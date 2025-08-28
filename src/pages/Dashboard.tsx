import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  supabase, 
  Player, 
  UserTeam, 
  Season,
  Team,
  isTransferAllowed,
  getActiveSeason,
  getUserTeam,
  getAvailablePlayers,
  buyPlayer,
  sellPlayer,
  getLeaderboard,
  getUserProfile,
  calculateUserPoints
} from '../lib/supabase';
import { Users, Trophy, Euro, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState<UserTeam[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(100000);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [transferDeadline, setTransferDeadline] = useState<string>('');
  const [transfersAfterDeadline, setTransfersAfterDeadline] = useState(3);
  const [leaderboard, setLeaderboard] = useState<Array<{
    user_id: string;
    total_points: number;
    team_value: number;
    display_name: string;
    rank: number;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'team' | 'leaderboard' | 'points'>('team');
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [transferAllowed, setTransferAllowed] = useState(true);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  // Load current season
  const loadCurrentSeason = async () => {
    try {
      const season = await getActiveSeason();
      setCurrentSeason(season);
      
      if (season) {
        setTransferDeadline(season.transfer_deadline || '');
        const deadlineDate = new Date(season.transfer_deadline || '');
        const currentDate = new Date();
        const isDeadlinePassed = currentDate > deadlineDate;
        setIsDeadlinePassed(isDeadlinePassed);
        
        // Calculate transfers after deadline
        if (isDeadlinePassed) {
          const { data: postDeadlinePlayers } = await supabase
            .from('user_teams')
            .select('bought_at')
            .eq('user_id', user?.id)
            .eq('season_id', season.id)
            .gte('bought_at', season.transfer_deadline);
          
          const postDeadlineCount = postDeadlinePlayers?.length || 0;
          setTransfersAfterDeadline(Math.max(0, season.transfers_after_deadline - postDeadlineCount));
        }
      }
    } catch (error) {
      console.error('Error loading current season:', error);
    }
  };

  const loadTransferStatus = async () => {
    try {
      if (currentSeason && user?.id) {
        const allowed = await isTransferAllowed(user.id, currentSeason.id);
        setTransferAllowed(allowed);
      } else {
        const allowed = await isTransferAllowed();
        setTransferAllowed(allowed);
      }
    } catch (error) {
      console.error('Error loading transfer status:', error);
      setTransferAllowed(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      await getUserProfile(user.id);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadUserData = async () => {
    if (!user?.id || !currentSeason) return;
    
    try {
      setLoading(true);
      
      // Load user team
      const teamData = await getUserTeam(user.id, currentSeason.id);
      setUserTeam(teamData);

      // Load available players
      const playersData = await getAvailablePlayers(user.id, currentSeason.id);
      setAvailablePlayers(playersData);

      // Calculate budget
      const currentTeamValue = teamData.reduce((sum, item) => sum + item.bought_price, 0);
      setBudget(currentSeason.initial_budget - currentTeamValue);

      // Calculate total points
      const points = await calculateUserPoints(user.id, currentSeason.id);
      setTotalPoints(points);

    } catch (error) {
      console.error('Fout bij laden gebruikersdata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboardData = async () => {
    if (!currentSeason) return;
    
    try {
      const leaderboardData = await getLeaderboard(currentSeason.id, 10);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Fout bij laden ranglijst:', error);
    }
  };

  const loadTeamsAndPositions = async () => {
    try {
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      setTeams(teamsData || []);
    } catch (error) {
      console.error('Error loading teams and positions:', error);
    }
  };

  const buyPlayerHandler = async (player: Player) => {
    if (!user?.id || !currentSeason) {
      alert('Je bent niet ingelogd of er is geen actief seizoen!');
      return;
    }

    const result = await buyPlayer(user.id, currentSeason.id, player.id, player.price);
    
    if (result.success) {
      await loadUserData();
      await loadLeaderboardData();
      alert(`${player.name} is toegevoegd aan je team!`);
    } else {
      alert(result.error || 'Er is een fout opgetreden bij het kopen van de speler');
    }
  };

  const sellPlayerHandler = async (userTeamItem: UserTeam) => {
    if (!user?.id || !currentSeason) {
      alert('Je bent niet ingelogd of er is geen actief seizoen!');
      return;
    }

    const player = userTeamItem.player;
    if (!player) {
      alert('Speler informatie niet gevonden!');
      return;
    }

    // Show confirmation
    const confirmMessage = `Weet je zeker dat je ${player.name} (${player.team?.name}) wilt verkopen?\n\n` +
                          `Prijs: €${player.price.toLocaleString()}\n` +
                          `Positie: ${player.position?.name}\n\n` +
                          `Deze actie kan niet ongedaan worden gemaakt.`;
    
    const isConfirmed = window.confirm(confirmMessage);
    if (!isConfirmed) {
      return;
    }

    const result = await sellPlayer(user.id, currentSeason.id, userTeamItem.id, player.price);
    
    if (result.success) {
      await loadUserData();
      await loadLeaderboardData();
      alert(`${player.name} is succesvol verkocht!`);
    } else {
      alert(result.error || 'Er is een fout opgetreden bij het verkopen van de speler');
    }
  };



  const getTeamNames = (): string[] => {
    return teams.map(team => team.name).sort();
  };

  const getAvailablePlayersByTeam = (): { [key: string]: Player[] } => {
    const grouped: { [key: string]: Player[] } = {};
    
    availablePlayers.forEach(player => {
      const teamName = player.team?.name || 'Onbekend';
      if (!grouped[teamName]) {
        grouped[teamName] = [];
      }
      grouped[teamName].push(player);
    });
    
    return grouped;
  };

  const toggleTeam = (teamName: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamName)) {
      newExpanded.delete(teamName);
    } else {
      newExpanded.add(teamName);
    }
    setExpandedTeams(newExpanded);
  };

  useEffect(() => {
    if (user) {
      loadCurrentSeason();
      loadUserProfile();
      loadTeamsAndPositions();
    }
  }, [user]);

  useEffect(() => {
    if (currentSeason && user) {
      loadUserData();
      loadLeaderboardData();
      loadTransferStatus();
    }
  }, [currentSeason, user]);

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

  if (!currentSeason) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen actief seizoen</h2>
          <p className="text-gray-600">Er is momenteel geen actief seizoen beschikbaar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Transfer Deadline Warning */}
      {isDeadlinePassed && (
        <div className="col-span-2 md:col-span-4 mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Transfer Deadline Verstreken!</strong>
            <span className="block sm:inline"> 
              De deadline van {transferDeadline ? new Date(transferDeadline).toLocaleDateString('nl-NL') : 'onbekend'} is verstreken. 
              Je kunt nog maximaal {transfersAfterDeadline} nieuwe spelers kopen (van de {currentSeason.transfers_after_deadline} toegestane transfers na deadline).
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
              Daarna kun je nog maximaal {currentSeason.transfers_after_deadline} nieuwe spelers kopen om je team te verbeteren.
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
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">{userTeam.length}/{currentSeason?.max_team_size || 15}</h3>
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
                const player = item.player;
                if (!player) return null;

                return (
                  <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <p className="text-sm text-gray-600">{player.position?.name}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {player.team?.points_per_goal || 1} pt
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">{player.team?.name}</span>
                      <span className="text-sm font-medium text-gray-900">€{player.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {player.total_goals} doelpunt{player.total_goals !== 1 ? 'en' : ''}
                      </span>
                      <button
                        onClick={() => sellPlayerHandler(item)}
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
                onClick={loadLeaderboardData}
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
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen ranglijst</h3>
              <p className="text-gray-600">Er zijn nog geen deelnemers met punten.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Positie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Punten
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Waarde
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr key={entry.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                              entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                              entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold">
                                {entry.display_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.display_name}
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
              
              {userTeam.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Nog geen spelers</h4>
                  <p className="text-gray-600">Koop spelers om punten te verdienen!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTeam.map((item) => {
                    const player = item.player;
                    if (!player) return null;

                    const goalsForPlayer = player.total_goals || 0;
                    const pointsForPlayer = goalsForPlayer * (player.team?.points_per_goal || 1);

                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{player.name}</h4>
                            <p className="text-sm text-gray-600">{player.team?.name} • {player.position?.name}</p>
                            <p className="text-xs text-gray-500">Gekocht op: {new Date(item.bought_at).toLocaleDateString('nl-NL')}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">{pointsForPlayer} pt</span>
                            <p className="text-sm text-gray-600">{player.team?.points_per_goal || 1} pt per goal</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Totaal doelpunten:</span>
                            <span className="text-sm font-medium text-gray-900">{goalsForPlayer}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">Berekening:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {goalsForPlayer} × {player.team?.points_per_goal || 1} = {pointsForPlayer} pt
                            </span>
                          </div>
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
              {teams.map(team => (
                <p key={team.id}>• <strong>{team.name}:</strong> {team.points_per_goal} punten per doelpunt</p>
              ))}
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
            {getTeamNames().map((teamName) => {
              const playersInTeam = getAvailablePlayersByTeam()[teamName] || [];
              const isExpanded = expandedTeams.has(teamName);
              const team = teams.find(t => t.name === teamName);
              
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
                          {team?.points_per_goal || 1} pt per doelpunt
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
                        {playersInTeam.map((player) => (
                          <div key={player.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{player.name}</h4>
                                <p className="text-sm text-gray-600">{player.position?.name}</p>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {player.team?.points_per_goal || 1} pt
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-gray-600">{player.team?.name}</span>
                              <span className="text-sm font-medium text-gray-900">€{player.price.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {player.total_goals} doelpunt{player.total_goals !== 1 ? 'en' : ''}
                              </span>
                              <button
                                onClick={() => buyPlayerHandler(player)}
                                disabled={!transferAllowed || budget < player.price || userTeam.length >= (currentSeason?.max_team_size || 15)}
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
      )}

      {/* Game Rules Summary - Only show when team tab is active */}
      {activeTab === 'team' && (
        <div className="kosc-section bg-gray-50">
          <h2 className="kosc-title text-2xl mb-6">Spelregels Overzicht</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Puntenverdeling</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {teams.map(team => (
                  <li key={team.id}>• <strong>{team.name}:</strong> {team.points_per_goal} punten per doelpunt</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Transferregels</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Maximaal {currentSeason?.max_team_size || 15} spelers in je team</li>
                <li>• Budget: €{currentSeason?.initial_budget.toLocaleString() || '100.000'}</li>
                <li>• Maximaal {currentSeason?.transfers_after_deadline || 3} transfers na start</li>
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
