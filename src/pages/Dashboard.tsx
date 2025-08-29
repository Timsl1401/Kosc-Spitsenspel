import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTeamPoints, isTransferAllowed } from '../lib/gameLogic';
import { 
  fetchPlayersSorted,
  fetchUserTeamActive,
  fetchUserTeamAll,
  fetchSettingValue,
  countUserBuysAfter,
  fetchGoalsForPlayerBetweenCount,
  fetchGoalsForPlayerBetween,
  buyUserTeam,
  sellUserTeam,
  fetchAllUserTeamsWithPlayers,
  ensureUserExists,
  fetchUsersByIds,
} from '../lib/db';
import { Users, Trophy, Euro, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

// Local minimal types aligned to the new dumb DB
type Player = {
  id: string;
  name: string;
  team: string;
  position: string;
  price: number;
  goals: number;
};

type UserTeam = {
  id: string;
  user_id: string;
  player_id: string;
  bought_at: string;
  sold_at: string | null;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState<UserTeam[]>([]);
  const [userTeamAll, setUserTeamAll] = useState<UserTeam[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(100000000);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsBreakdown, setPointsBreakdown] = useState<Record<string, { totalPoints: number; totalGoals: number; perTeam: Record<string, { goals: number; points: number }> }>>({});
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [transferDeadline, setTransferDeadline] = useState<string>('');
  const [transfersAfterDeadline, setTransfersAfterDeadline] = useState(3);
  const [leaderboard, setLeaderboard] = useState<Array<{
    user_id: string;
    total_points: number;
    team_value: number;
    user_email: string;
    rank: number;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'team' | 'leaderboard' | 'points' | 'topscorers'>('team');
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [transferAllowed, setTransferAllowed] = useState(true);
  const [topScorers, setTopScorers] = useState<Array<{ player_id: string; name: string; team: string; position: string; goals: number }>>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [teamPointsData, setTeamPointsData] = useState<Record<string, number>>({});


  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Helper functie om team points synchronously te krijgen
  const getTeamPointsSync = (teamName: string): number => {
    return teamPointsData[teamName] || 1.0; // Default naar 1.0 als niet geladen
  };

  // Laad team points data
  const loadTeamPoints = async () => {
    try {
      const uniqueTeams = [...new Set(availablePlayers.map(p => p.team))];
      const pointsData: Record<string, number> = {};

      for (const team of uniqueTeams) {
        try {
          const points = await getTeamPoints(team);
          pointsData[team] = points;
        } catch (error) {
          console.error(`Error loading points for team ${team}:`, error);
          // Veilige fallback (1 punt tenzij KOSC 1 of 2)
          if (team.includes('KOSC 1')) pointsData[team] = 3.0;
          else if (team.includes('KOSC 2')) pointsData[team] = 2.0;
          else pointsData[team] = 1.0;
        }
      }

      setTeamPointsData(pointsData);
    } catch (error) {
      console.error('Error loading team points:', error);
    }
  };

  const loadTransferStatus = async () => {
    try {
      const allowed = await isTransferAllowed();
      setTransferAllowed(allowed);
    } catch (error) {
      console.error('Error loading transfer status:', error);
      setTransferAllowed(false);
    }
  };

  // Profiles are not managed in DB; keep auth metadata in memory only
  const loadUserProfile = async () => {};

  const loadTopScorers = async () => {
    try {
      const topScorersData = availablePlayers
        .filter((player) => (player.goals || 0) > 0)
        .sort((a, b) => (b.goals || 0) - (a.goals || 0))
        .slice(0, 10)
        .map(player => ({
          player_id: player.id,
          name: player.name,
          team: player.team,
          position: player.position,
          goals: player.goals || 0,
        }));
      
      setTopScorers(topScorersData);
    } catch (error) {
      console.error('Error loading top scorers:', error);
      setTopScorers([]);
    }
  };

  const loadTransferDeadline = async () => {
    const value = await fetchSettingValue('start_deadline');
    if (value) {
      setTransferDeadline(value);
      const deadlineDate = new Date(value);
      const currentDate = new Date();
      const isDeadlinePassed = currentDate > deadlineDate;
      setIsDeadlinePassed(isDeadlinePassed);
      
      // Als de deadline is geweest, bereken hoeveel transfers er nog over zijn
      if (isDeadlinePassed) {
        const postDeadlineCount = user?.id ? await countUserBuysAfter(user.id, value) : 0;
        setTransfersAfterDeadline(Math.max(0, 3 - postDeadlineCount));
      }
    }
  };

  // Verouderd helper; puntenberekening gebruikt nu individuele goals in venster

  const toggleTeam = (teamName: string) => {
    const newExpandedTeams = new Set(expandedTeams);
    if (newExpandedTeams.has(teamName)) {
      newExpandedTeams.delete(teamName);
    } else {
      newExpandedTeams.add(teamName);
    }
    setExpandedTeams(newExpandedTeams);
  };

  const getAvailablePlayersByTeam = () => {
    const playersByTeam: { [key: string]: Player[] } = {};
    
    availablePlayers.forEach(player => {
      const isOwned = userTeam.find(ut => ut.player_id === player.id && !ut.sold_at);
      if (!isOwned) {
        const teamName = player.team || '';
        if (!playersByTeam[teamName]) {
          playersByTeam[teamName] = [];
        }
        playersByTeam[teamName].push(player);
      }
    });

    return playersByTeam;
  };

  const getTeamNames = () => {
    const teams = new Set(availablePlayers.map(p => p.team || ''));
    const teamArray = Array.from(teams);
    
    // Groepeer teams per speeldag
    const zondagTeams = teamArray.filter(team => team.includes('Zondag') || team.includes('zondag'));
    const zaterdagTeams = teamArray.filter(team => team.includes('Zaterdag') || team.includes('zaterdag'));
    const andereTeams = teamArray.filter(team => 
      !team.includes('Zondag') && !team.includes('zondag') && 
      !team.includes('Zaterdag') && !team.includes('zaterdag')
    );
    
    // Sorteer binnen elke groep en combineer
    return [
      ...zondagTeams.sort(),
      ...zaterdagTeams.sort(),
      ...andereTeams.sort()
    ];
  };

  const loadLeaderboard = async () => {
    try {
      console.log('Laden ranglijst...');
      
      const userTeamsData = await fetchAllUserTeamsWithPlayers();

      console.log('User teams data:', userTeamsData);

      // Als er geen teams zijn, toon lege ranglijst
      if (!userTeamsData || userTeamsData.length === 0) {
        console.log('Geen teams gevonden in database');
        setLeaderboard([]);
        return;
      }

      // Profielen niet gebruikt

      // Groepeer per gebruiker en bereken punten
      const userPoints: { [key: string]: { points: number; teamValue: number; label: string } } = {};
      
      for (const userTeam of userTeamsData) {
        const player = userTeam.player as any;
          const userId = userTeam.user_id as string;
          
          if (!userPoints[userId]) {
            const rawDisplay = (userTeam as any).user?.display_name as string | undefined;
            const label = rawDisplay && rawDisplay.trim() !== '' ? rawDisplay.trim() : `Speler ${userId.slice(0,6)}`;
            userPoints[userId] = { points: 0, teamValue: 0, label };
          }
          
          // Bereken punten op basis van individuele goals tussen koop en verkoop
          const count = await fetchGoalsForPlayerBetweenCount(player.id, userTeam.bought_at, userTeam.sold_at || undefined);
          for (let i = 0; i < count; i++) {
            const teamName = player.team;
            userPoints[userId].points += getTeamPointsSync(teamName);
          }
          
          // Teamwaarde = som van ACTIEVE spelers (verkochte niet meetellen)
          if (!userTeam.sold_at) {
            userPoints[userId].teamValue += player.price;
          }
        
      }

      console.log('User points berekend:', userPoints);

      // Labels verrijken uitsluitend als huidige labels op e-mails lijken (PII)
      const ids = Object.keys(userPoints)
      if (ids.length > 0) {
        const currentLabels = Object.values(userPoints).map(v => v.label)
        const anyEmailLike = currentLabels.some(l => typeof l === 'string' && l.includes('@'))
        if (anyEmailLike) {
          const rows = await fetchUsersByIds(ids)
          const displayNameMap: Record<string, string> = {}
          rows.forEach(r => {
            const dn = (r.display_name ?? '').trim()
            if (dn) displayNameMap[r.id] = dn
          })
          Object.entries(userPoints).forEach(([uid, data]) => {
            const newLabel = displayNameMap[uid]
            if (newLabel && typeof data.label === 'string' && data.label.includes('@')) {
              data.label = newLabel
            }
          })
        }
      }

      // Converteer naar array en sorteer op punten
      const leaderboardArray = Object.entries(userPoints)
        .map(([userId, data]) => ({
          user_id: userId,
          total_points: data.points,
          team_value: data.teamValue,
          user_email: data.label,
          rank: 0
        }))
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, 10)
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }));

      console.log('Finale ranglijst:', leaderboardArray);
      setLeaderboard(leaderboardArray);
    } catch (error) {
      console.error('Fout bij laden ranglijst:', error);
      // Zet lege ranglijst bij fout
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    if (user) {
      // checkFirstTimeUser() is uitgeschakeld om problemen te voorkomen
      loadUserData();
      loadTransferDeadline();
      loadLeaderboard();
      loadTransferStatus();
      loadUserProfile();
      loadTopScorers();
    }
  }, [user]);

  // Laad team points wanneer availablePlayers verandert
  useEffect(() => {
    if (availablePlayers.length > 0) {
      loadTeamPoints();
    }
  }, [availablePlayers]);

  useEffect(() => {
    if (activeTab === 'topscorers') {
      loadTopScorers();
    }
  }, [activeTab, availablePlayers]);



  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Laad het actieve team (niet verkocht)
      const teamData = user?.id ? await fetchUserTeamActive(user.id) : [];
      setUserTeam(teamData as unknown as UserTeam[]);

      // Laad alle team items (inclusief verkochte) voor puntenberekening
      const teamDataAll = user?.id ? await fetchUserTeamAll(user.id) : [];
      setUserTeamAll(teamDataAll as unknown as UserTeam[]);

      // Load available players
      const playersData = await fetchPlayersSorted();
      setAvailablePlayers(playersData as unknown as Player[]);

      // Calculate budget and team value
      const currentTeamValue = teamData?.reduce((sum, item) => {
        const player = playersData?.find(p => p.id === item.player_id);
        return sum + (player?.price || 0);
      }, 0) || 0;

      setBudget(100000000 - currentTeamValue);

      // Bereken punten op basis van individuele goals tussen koop en verkoop
      const breakdown: Record<string, { totalPoints: number; totalGoals: number; perTeam: Record<string, { goals: number; points: number }> }> = {};
      let aggregatePoints = 0;
      for (const item of teamDataAll || []) {
        const player = playersData?.find(p => p.id === item.player_id);
        if (!player || !item.bought_at) continue;

        const goals = await fetchGoalsForPlayerBetween(player.id, item.bought_at, item.sold_at || undefined);
        if (!goals.length) continue;

        const perTeam: Record<string, { goals: number; points: number }> = {};
        let playerPoints = 0;
        for (const g of goals) {
          const effectiveTeam = g.team_code && g.team_code.trim() !== '' ? g.team_code : player.team;
          const pts = getTeamPointsSync(effectiveTeam);
          playerPoints += pts;
          if (!perTeam[effectiveTeam]) perTeam[effectiveTeam] = { goals: 0, points: 0 };
          perTeam[effectiveTeam].goals += 1;
          perTeam[effectiveTeam].points += pts;
        }
        if (playerPoints > 0) {
          breakdown[item.id] = { totalPoints: playerPoints, totalGoals: goals.length, perTeam };
          aggregatePoints += playerPoints;
        }
      }
      setPointsBreakdown(breakdown);
      setTotalPoints(aggregatePoints);

      // Note: transfers are now limited to max 3 players in team

    } catch (error) {
      console.error('Fout bij laden gebruikersdata:', error);
    } finally {
      setLoading(false);
    }
  };

  const buyPlayer = async (player: Player) => {
    console.log('Buying player:', player.name, 'User ID:', user?.id);
    
    // Check weekend restriction
    const transferAllowed = await isTransferAllowed();
    if (!transferAllowed) {
      showNotification('error', 'Transfers zijn niet toegestaan in het weekend!');
      return;
    }

    // Check budget
    if (budget < player.price) {
      showNotification('error', `Je hebt niet genoeg budget om deze speler te kopen! Budget: €${budget}, Prijs: €${player.price}`);
      return;
    }

    // Check team size (max 15 players)
    if (userTeam.length >= 15) {
      showNotification('error', 'Je team is al vol (maximaal 15 spelers)!');
      return;
    }

    // Check transfers after deadline (max 3)
    if (isDeadlinePassed && transfersAfterDeadline <= 0) {
      showNotification('error', 'Je hebt geen transfers meer over na de deadline! Je kunt geen nieuwe spelers meer kopen.');
      return;
    }

    if (!user?.id) {
      showNotification('error', 'Je bent niet ingelogd!');
      return;
    }

    try {
      // Zorg dat user in users-tabel bestaat om FK-conflict te voorkomen
      await ensureUserExists(user.id, user.email || null, user.email?.split('@')[0] || null);
      console.log('Inserting player into user_teams...');
      const ok = await buyUserTeam(user.id, player.id, player.price);
      if (!ok) throw new Error('Insert failed');

      console.log('Player bought successfully');

      // Update transfers after deadline if applicable
      if (isDeadlinePassed) {
        setTransfersAfterDeadline(prev => Math.max(0, prev - 1));
      }

      // Show success notification immediately
      showNotification('success', `${player.name} is toegevoegd aan je team!`);

      // Reload data in background
      loadUserData();
      loadLeaderboard(); // Update ranglijst na kopen speler

    } catch (error: any) {
      console.error('Fout bij kopen speler:', error);
      showNotification('error', `Er is een fout opgetreden bij het kopen van de speler: ${error.message || 'Onbekende fout'}`);
    }
  };

  const sellPlayer = async (userTeamItem: UserTeam) => {
    // Check weekend restriction
    const transferAllowed = await isTransferAllowed();
    if (!transferAllowed) {
      showNotification('error', 'Transfers zijn niet toegestaan in het weekend!');
      return;
    }

    // Haal speler informatie op voor bevestigingsmelding
    const player = availablePlayers.find(p => p.id === userTeamItem.player_id);
    if (!player) {
      showNotification('error', 'Speler informatie niet gevonden!');
      return;
    }

    // Toon bevestigingsmelding
    const confirmMessage = `Weet je zeker dat je ${player.name} (${player.team}) wilt verkopen?\n\n` +
                          `Prijs: €${player.price.toLocaleString()}\n` +
                          `Positie: ${player.position}\n\n` +
                          `Deze actie kan niet ongedaan worden gemaakt.`;
    
    const isConfirmed = window.confirm(confirmMessage);
    if (!isConfirmed) {
      return; // Gebruiker heeft geannuleerd
    }

    try {
      const ok = await sellUserTeam(userTeamItem.id);
      if (!ok) throw new Error('Update failed');

      // Show success notification immediately
      showNotification('success', `${player.name} is succesvol verkocht!`);

      // Reload data in background
      loadUserData();
      loadLeaderboard(); // Update ranglijst na verkopen speler

    } catch (error) {
      console.error('Fout bij verkopen speler:', error);
      showNotification('error', 'Er is een fout opgetreden bij het verkopen van de speler.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className={`rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : notification.type === 'error' 
                ? 'bg-red-500 text-white' 
                : 'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'error' && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'info' && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setNotification(null)}
                  className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Deadline Warning */}
      {isDeadlinePassed && (
        <div className="col-span-2 md:col-span-4 mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Transfer Deadline Verstreken!</strong>
            <span className="block sm:inline"> 
              De deadline van {transferDeadline ? new Date(transferDeadline).toLocaleDateString('nl-NL') : 'onbekend'} is verstreken. 
              Je kunt nog maximaal {transfersAfterDeadline} nieuwe spelers kopen (van de 3 toegestane transfers na deadline).
            </span>
          </div>
        </div>
      )}
      
      {/* Transfer Deadline Info */}
      {!isDeadlinePassed && transferDeadline && (
        <div className="col-span-2 md:col-span-4 mb-6">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Transfer Deadline Info</strong>
            <span className="block sm:inline"> 
              Je kunt spelers kopen tot {new Date(transferDeadline).toLocaleDateString('nl-NL')}. 
              Daarna kun je nog maximaal 3 nieuwe spelers kopen om je team te verbeteren.
            </span>
          </div>
        </div>
      )}



      {/* Tab Navigation */}
      <div className="col-span-2 md:col-span-4 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('team')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'team'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mijn Team
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaderboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Top 10 Ranglijst
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'points'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Punten Overzicht
            </button>
            <button
              onClick={() => setActiveTab('topscorers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'topscorers'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Topscorers
            </button>
          </nav>
        </div>
      </div>

      {/* Header Stats - Only show when team tab is active */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="kosc-card text-center cursor-pointer hover:bg-green-50 transition-colors" onClick={() => setActiveTab('points')}>
            <div className="flex items-center justify-center mb-3">
              <Trophy className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">{totalPoints}</h3>
            <p className="text-sm md:text-base text-gray-600">Totaal Punten</p>
            <p className="text-xs text-green-600 mt-1">Klik voor details</p>
          </div>

          <div className="kosc-card text-center">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">{userTeam.length}/15</h3>
            <p className="text-sm md:text-base text-gray-600">Spelers in Team</p>
          </div>

          <div className="kosc-card text-center">
            <div className="flex items-center justify-center mb-3">
              <Euro className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">€{budget.toLocaleString()}</h3>
            <p className="text-sm md:text-base text-gray-600">Beschikbaar Budget</p>
          </div>

          <div className="kosc-card text-center">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">
              {isDeadlinePassed ? transfersAfterDeadline : '∞'}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {isDeadlinePassed ? 'Transfers Over' : 'Transfers Mogelijk'}
            </p>
          </div>
        </div>
      )}

      {/* Transfer Status - Only show when team tab is active */}
      {activeTab === 'team' && !transferAllowed && (
        <div className="kosc-section bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Weekend Regel</h3>
              <p className="text-yellow-700">
                Transfers zijn niet toegestaan in het weekend (zaterdag en zondag).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'team' && (
        /* Current Team */
        <div className="kosc-section">
          <h2 className="kosc-title text-2xl mb-6">Mijn Team</h2>
          
          {userTeam.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen spelers</h3>
              <p className="text-gray-600">Koop je eerste spelers om te beginnen!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTeam.map((item) => {
                const player = availablePlayers.find((p) => p.id === item.player_id);
                if (!player) return null;

                return (
                  <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <p className="text-sm text-gray-600">{player.position}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {getTeamPointsSync(player.team)} pt
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">{player.team}</span>
                      <span className="text-sm font-medium text-gray-900">€{player.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {player.goals} doelpunt{player.goals !== 1 ? 'en' : ''}
                      </span>
                      <button
                        onClick={() => sellPlayer(item)}
                        disabled={!transferAllowed}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Verkoop
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        /* Leaderboard - Full Page Tab */
        <div className="space-y-6">
          {/* Leaderboard Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
            <div className="text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-2">Top 10 Ranglijst</h2>
              <p className="text-green-100">De beste spelers van het KOSC Spitsenspel</p>
              <button
                onClick={loadLeaderboard}
                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Vernieuwen
              </button>
            </div>
          </div>

          {/* Leaderboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{leaderboard.length}</div>
              <div className="text-gray-600">Deelnemers</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {leaderboard.length > 0 ? leaderboard[0]?.total_points || 0 : 0}
              </div>
              <div className="text-gray-600">Hoogste Score</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.total_points, 0) / leaderboard.length) : 0}
              </div>
              <div className="text-gray-600">Gemiddelde Score</div>
            </div>
          </div>

          {/* Leaderboard Table */}
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen ranglijst</h3>
              <p className="text-gray-600">De ranglijst wordt geladen...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Positie
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speler
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Punten
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Waarde
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.user_id} className={`hover:bg-gray-50 transition-colors ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : ''
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <span className="text-3xl mr-3">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            ) : null}
                            <span className={`text-lg font-bold ${
                              index < 3 ? 'text-yellow-600' : 'text-gray-900'
                            }`}>
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold">
                                {entry.user_email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.user_email}
                              </div>

                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xl font-bold text-green-600">
                            {entry.total_points}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            €{entry.team_value.toLocaleString()}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leaderboard Footer */}
          <div className="bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-600">
            <p>Top 10 ranglijst op basis van behaalde punten</p>
          </div>
        </div>
      )}

      {activeTab === 'points' && (
        /* Punten Overzicht - Full Page Tab */
        <div className="space-y-6">
          {/* Punten Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Punten Overzicht</h2>
              <p className="text-green-100">Bekijk hoe je aan je {totalPoints} punten bent gekomen</p>
            </div>
          </div>

          {/* Punten Samenvatting */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <div className="text-gray-600">Totaal Punten</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{userTeam.length}</div>
              <div className="text-gray-600">Spelers in Team</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {userTeam.length > 0 ? Math.round(totalPoints / userTeam.length * 10) / 10 : 0}
              </div>
              <div className="text-gray-600">Gemiddelde per Speler</div>
            </div>
          </div>

          {/* Gedetailleerd Punten Overzicht */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Punten per Speler</h3>
              
              {userTeamAll.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Nog geen spelers</h4>
                  <p className="text-gray-600">Koop spelers om punten te verdienen!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTeamAll
                    .filter((item) => pointsBreakdown[item.id] && pointsBreakdown[item.id].totalPoints > 0)
                    .map((item) => {
                      const player = availablePlayers.find(p => p.id === item.player_id);
                      if (!player) return null;

                      const breakdown = pointsBreakdown[item.id];
                      const pointsForPlayer = breakdown?.totalPoints || 0;

                      return (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{player.name}</h4>
                              <p className="text-sm text-gray-600">{player.team} • {player.position}</p>
                              <p className="text-xs text-gray-500">Gekocht op: {new Date(item.bought_at).toLocaleDateString('nl-NL')}</p>
                              {item.sold_at && (
                                <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Verkocht</span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">{pointsForPlayer} pt</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Totaal doelpunten:</span>
                              <span className="text-sm font-medium text-gray-900">{breakdown?.totalGoals || 0}</span>
                            </div>
                            {breakdown && Object.entries(breakdown.perTeam).map(([teamName, t]) => (
                              <div key={teamName} className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-600">{teamName} aantal doelpunten:</span>
                                <span className="text-sm font-medium text-gray-900">{t.goals}</span>
                              </div>
                            ))}
                            {breakdown && Object.entries(breakdown.perTeam).map(([teamName, t]) => (
                              <div key={teamName + '-calc'} className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-600">Berekening:</span>
                                <span className="text-sm font-medium text-gray-900">{t.goals} × {getTeamPointsSync(teamName)} = {t.points} pt</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Punten Uitleg */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Hoe werken de punten?</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>KOSC 1:</strong> 3 punten per doelpunt</p>
              <p>• <strong>KOSC 2:</strong> 2 punten per doelpunt</p>
              <p>• <strong>KOSC 3 t/m 7:</strong> 1 punt per doelpunt</p>
              <p>• <strong>KOSC zaterdag 2/3:</strong> 1 punt per doelpunt</p>
              <p>• <strong>KOSC A1:</strong> 1 punt per doelpunt</p>
              <p>• Je krijgt alleen punten voor doelpunten die <strong>na je aankoop</strong> worden gescoord</p>
            </div>
          </div>
        </div>
      )}

      {/* Available Players by Team - Only show when team tab is active */}
      {activeTab === 'team' && (
        <div className="kosc-section">
          <h2 className="kosc-title text-2xl mb-6">Beschikbare Spelers per Team</h2>
          
          <div className="space-y-6">
            {/* Zondag Teams Sectie */}
            {(() => {
              const zondagTeams = getTeamNames().filter(team => 
                team.includes('Zondag') || team.includes('zondag')
              );
              if (zondagTeams.length > 0) {
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                      🗓️ Zondag Teams
                    </h3>
                    <div className="space-y-4">
                      {zondagTeams.map((teamName) => {
                        const playersInTeam = getAvailablePlayersByTeam()[teamName] || [];
                        const isExpanded = expandedTeams.has(teamName);
                        
                        return (
                          <div key={teamName} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleTeam(teamName)}
                              className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 text-left transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{teamName}</h3>
                                  <span className="text-sm text-gray-600">
                                    {playersInTeam.length} beschikbare speler{playersInTeam.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-600">
                                    {getTeamPointsSync(teamName)} pt per doelpunt
                                  </span>
                                  <svg
                                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="bg-white border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                  {playersInTeam.map((player: Player) => (
                                    <div key={player.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h4 className="font-semibold text-gray-900">{player.name}</h4>
                                          <p className="text-sm text-gray-600">{player.position}</p>
                                        </div>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                          {getTeamPointsSync(player.team)} pt
                                        </span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-600">{player.team}</span>
                                        <span className="text-sm font-medium text-gray-900">€{player.price.toLocaleString()}</span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          {player.goals} doelpunt{player.goals !== 1 ? 'en' : ''}
                                        </span>
                                        <button
                                          onClick={() => buyPlayer(player)}
                                          disabled={!transferAllowed || budget < player.price || userTeam.length >= 15}
                                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Koop
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Zaterdag Teams Sectie */}
            {(() => {
              const zaterdagTeams = getTeamNames().filter(team => 
                team.includes('Zaterdag') || team.includes('zaterdag')
              );
              if (zaterdagTeams.length > 0) {
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                      Zaterdag Teams
                    </h3>
                    <div className="space-y-4">
                      {zaterdagTeams.map((teamName) => {
                        const playersInTeam = getAvailablePlayersByTeam()[teamName] || [];
                        const isExpanded = expandedTeams.has(teamName);
                        
                        return (
                          <div key={teamName} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleTeam(teamName)}
                              className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 text-left transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{teamName}</h3>
                                  <span className="text-sm text-gray-600">
                                    {playersInTeam.length} beschikbare speler{playersInTeam.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-600">
                                    {getTeamPointsSync(teamName)} pt per doelpunt
                                  </span>
                                  <svg
                                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="bg-white border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                  {playersInTeam.map((player: Player) => (
                                    <div key={player.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h4 className="text-lg font-semibold text-gray-900">{player.name}</h4>
                                          <p className="text-sm text-gray-600">{player.position}</p>
                                        </div>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                          {getTeamPointsSync(player.team)} pt
                                        </span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-600">{player.team}</span>
                                        <span className="text-sm font-medium text-gray-900">€{player.price.toLocaleString()}</span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          {player.goals} doelpunt{player.goals !== 1 ? 'en' : ''}
                                        </span>
                                        <button
                                          onClick={() => buyPlayer(player)}
                                          disabled={!transferAllowed || budget < player.price || userTeam.length >= 15}
                                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Koop
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Andere Teams Sectie */}
            {(() => {
              const andereTeams = getTeamNames().filter(team => 
                !team.includes('Zondag') && !team.includes('zondag') && 
                !team.includes('Zaterdag') && !team.includes('zaterdag')
              );
              if (andereTeams.length > 0) {
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-500">
                      Zondag Teams
                    </h3>
                    <div className="space-y-4">
                      {andereTeams.map((teamName) => {
                        const playersInTeam = getAvailablePlayersByTeam()[teamName] || [];
                        const isExpanded = expandedTeams.has(teamName);
                        
                        return (
                          <div key={teamName} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleTeam(teamName)}
                              className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 text-left transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{teamName}</h3>
                                  <span className="text-sm text-gray-600">
                                    {playersInTeam.length} beschikbare speler{playersInTeam.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-600">
                                    {getTeamPointsSync(teamName)} pt per doelpunt
                                  </span>
                                  <svg
                                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="bg-white border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                  {playersInTeam.map((player: Player) => (
                                    <div key={player.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h4 className="text-lg font-semibold text-gray-900">{player.name}</h4>
                                          <p className="text-sm text-gray-600">{player.position}</p>
                                        </div>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                          {getTeamPointsSync(player.team)} pt
                                        </span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-600">{player.team}</span>
                                        <span className="text-sm font-medium text-gray-900">€{player.price.toLocaleString()}</span>
                                      </div>
                                      
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          {player.goals} doelpunt{player.goals !== 1 ? 'en' : ''}
                                        </span>
                                        <button
                                          onClick={() => buyPlayer(player)}
                                          disabled={!transferAllowed || budget < player.price || userTeam.length >= 15}
                                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Koop
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}

      {activeTab === 'topscorers' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Topscorers</h2>
              <p className="text-green-100">Top 10 doelpuntenmakers</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positie</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topScorers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-600">Nog geen goals geregistreerd</td>
                    </tr>
                  ) : (
                    topScorers.map((scorer, idx) => (
                      <tr key={scorer.player_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{scorer.name}</td>
                        <td className="px-6 py-4 text-gray-700">{scorer.team}</td>
                        <td className="px-6 py-4 text-gray-700">{scorer.position}</td>
                        <td className="px-6 py-4 font-bold text-green-600">{scorer.goals}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Game Rules Summary - Only show when team tab is active */}
      {activeTab === 'team' && (
        <div className="kosc-section bg-gray-50">
        <h2 className="kosc-title text-2xl mb-6">Spelregels Overzicht</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Puntenverdeling</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>KOSC 1:</strong> 3 punten per doelpunt</li>
              <li>• <strong>KOSC 2:</strong> 2,5 punten per doelpunt</li>
              <li>• <strong>KOSC 3:</strong> 2 punten per doelpunt</li>
              <li>• <strong>KOSC 4-8:</strong> 1 punt per doelpunt</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Transferregels</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Maximaal 15 spelers in je team</li>
              <li>• Budget: €100.000.000</li>
              <li>• Maximaal 3 transfers na start</li>
              <li>• Geen transfers in het weekend</li>
            </ul>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
