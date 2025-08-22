import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Player, UserTeam, getTeamPoints, isTransferAllowed } from '../lib/supabase';
import { Users, Trophy, Euro, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState<UserTeam[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(100000);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [transferDeadline, setTransferDeadline] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<Array<{
    user_id: string;
    total_points: number;
    team_value: number;
    user_email: string;
    rank: number;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'team' | 'leaderboard'>('team');
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());


  const loadTransferDeadline = async () => {
    const { data: deadlineData } = await supabase
      .from('game_settings')
      .select('value')
      .eq('key', 'start_deadline')
      .single();
    
    if (deadlineData) {
      setTransferDeadline(deadlineData.value);
      const deadlineDate = new Date(deadlineData.value);
      const currentDate = new Date();
      setIsDeadlinePassed(currentDate > deadlineDate);
    }
  };

  const getGoalsAfterPurchase = (_playerId: string, _purchaseDate: string): number => {
    // For now, return 0 - this will be implemented with real goal tracking
    // In the future, this should query the goals table for goals scored after purchaseDate
    return 0;
  };

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
        if (!playersByTeam[player.team]) {
          playersByTeam[player.team] = [];
        }
        playersByTeam[player.team].push(player);
      }
    });

    return playersByTeam;
  };

  const getTeamNames = () => {
    const teams = new Set(availablePlayers.map(p => p.team));
    return Array.from(teams).sort();
  };

  const loadLeaderboard = async () => {
    try {
      // Get top 10 users by points
      const { data: leaderboardData, error } = await supabase
        .rpc('calculate_user_points')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Add rank and format data
      const formattedLeaderboard = leaderboardData?.map((item, index) => ({
        ...item,
        rank: index + 1,
        user_email: item.user_email || 'Onbekend'
      })) || [];

      setLeaderboard(formattedLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
      loadTransferDeadline();
      loadLeaderboard();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user's team
      const { data: teamData, error: teamError } = await supabase
        .from('user_teams')
        .select('*')
        .eq('user_id', user?.id)
        .is('sold_at', null);

      if (teamError) throw teamError;
      setUserTeam(teamData || []);

      // Load available players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('team', { ascending: true })
        .order('name', { ascending: true });

      if (playersError) throw playersError;
      setAvailablePlayers(playersData || []);

      // Calculate budget and team value
      const currentTeamValue = teamData?.reduce((sum, item) => {
        const player = playersData?.find(p => p.id === item.player_id);
        return sum + (player?.price || 0);
      }, 0) || 0;

      setBudget(100000 - currentTeamValue);

      // Calculate total points - ONLY for goals scored AFTER purchase
      const points = teamData?.reduce((sum, item) => {
        const player = playersData?.find(p => p.id === item.player_id);
        if (player && item.bought_at) {
          // Get goals scored after purchase date
          const goalsAfterPurchase = getGoalsAfterPurchase(player.id, item.bought_at);
          return sum + (goalsAfterPurchase * getTeamPoints(player.team));
        }
        return sum;
      }, 0) || 0;

      setTotalPoints(points);

      // Note: transfers are now limited to max 3 players in team

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buyPlayer = async (player: Player) => {
    console.log('Buying player:', player.name, 'User ID:', user?.id);
    
    // Check transfer deadline
    if (isDeadlinePassed) {
      alert('De transfer deadline is verstreken! Je kunt geen nieuwe spelers meer kopen.');
      return;
    }

    // Check weekend restriction
    if (!isTransferAllowed()) {
      alert('Transfers zijn niet toegestaan in het weekend!');
      return;
    }

    // Check budget
    if (budget < player.price) {
      alert(`Je hebt niet genoeg budget om deze speler te kopen! Budget: €${budget}, Prijs: €${player.price}`);
      return;
    }

    // Check team size
    if (userTeam.length >= 15) {
      alert('Je team is al vol (maximaal 15 spelers)!');
      return;
    }

    // Check transfers remaining (max 3 players in team)
    if (userTeam.length >= 3) {
      alert('Je hebt al 3 spelers gekocht! Je kunt geen nieuwe spelers meer kopen.');
      return;
    }

    if (!user?.id) {
      alert('Je bent niet ingelogd!');
      return;
    }

    try {
      console.log('Inserting player into user_teams...');
      const { data, error } = await supabase
        .from('user_teams')
        .insert({
          user_id: user.id,
          player_id: player.id,
          bought_at: new Date().toISOString(),
          points_earned: 0
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Player bought successfully:', data);

      // Reload data (transfers remaining will be recalculated)
      await loadUserData();
      alert(`${player.name} is toegevoegd aan je team!`);

    } catch (error: any) {
      console.error('Error buying player:', error);
      alert(`Er is een fout opgetreden bij het kopen van de speler: ${error.message || 'Onbekende fout'}`);
    }
  };

  const sellPlayer = async (userTeamItem: UserTeam) => {
    // Check weekend restriction
    if (!isTransferAllowed()) {
      alert('Transfers zijn niet toegestaan in het weekend!');
      return;
    }

    // Check if player was bought before deadline
    if (transferDeadline) {
      const playerBoughtDate = new Date(userTeamItem.bought_at);
      const deadlineDate = new Date(transferDeadline);
      
      if (playerBoughtDate < deadlineDate) {
        alert('Je kunt deze speler niet verkopen omdat hij voor de deadline is gekocht!');
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('user_teams')
        .update({ sold_at: new Date().toISOString() })
        .eq('id', userTeamItem.id);

      if (error) throw error;

      // Reload data
      await loadUserData();
      alert('Speler is verkocht!');

    } catch (error) {
      console.error('Error selling player:', error);
      alert('Er is een fout opgetreden bij het verkopen van de speler.');
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
      {/* Transfer Deadline Warning */}
      {isDeadlinePassed && (
        <div className="col-span-2 md:col-span-4 mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Transfer Deadline Verstreken!</strong>
            <span className="block sm:inline"> 
              De deadline van {transferDeadline ? new Date(transferDeadline).toLocaleDateString('nl-NL') : 'onbekend'} is verstreken. 
              Je kunt geen nieuwe spelers meer kopen. Je team is definitief!
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
              Daarna is je team definitief!
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
          </nav>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="kosc-card text-center">
          <div className="flex items-center justify-center mb-3">
            <Trophy className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-800">{totalPoints}</h3>
          <p className="text-sm md:text-base text-gray-600">Totaal Punten</p>
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
          <h3 className="text-lg md:text-2xl font-bold text-gray-800">{userTeam.length}/3</h3>
          <p className="text-sm md:text-base text-gray-600">Spelers Gekocht</p>
        </div>
      </div>

      {/* Transfer Status */}
      {!isTransferAllowed() && (
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
      {activeTab === 'team' ? (
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
                const player = availablePlayers.find(p => p.id === item.player_id);
                if (!player) return null;

                return (
                  <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <p className="text-sm text-gray-600">{player.position}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {getTeamPoints(player.team)} pt
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
                        disabled={!isTransferAllowed()}
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
      ) : (
        /* Leaderboard */
        <div className="kosc-section">
          <h2 className="kosc-title text-2xl mb-6">Top 10 Ranglijst</h2>
          
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen ranglijst</h3>
              <p className="text-gray-600">De ranglijst wordt geladen...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
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
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.user_id} className={index < 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <span className="text-2xl mr-2">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          ) : null}
                          <span className={`text-sm font-medium ${
                            index < 3 ? 'text-yellow-600' : 'text-gray-900'
                          }`}>
                            #{entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.user_email.split('@')[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">
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
          )}
        </div>
      )}

      {/* Available Players by Team */}
      <div className="kosc-section">
        <h2 className="kosc-title text-2xl mb-6">Beschikbare Spelers per Team</h2>
        
        <div className="space-y-4">
          {getTeamNames().map((teamName) => {
            const playersInTeam = getAvailablePlayersByTeam()[teamName] || [];
            const isExpanded = expandedTeams.has(teamName);
            
            return (
              <div key={teamName} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Team Header - Clickable */}
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
                        {getTeamPoints(teamName)} pt per doelpunt
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
                
                {/* Team Players - Expandable */}
                {isExpanded && (
                  <div className="bg-white border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                      {playersInTeam.map((player) => (
                        <div key={player.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{player.name}</h4>
                              <p className="text-sm text-gray-600">{player.position}</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {getTeamPoints(player.team)} pt
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
                              disabled={!isTransferAllowed() || budget < player.price || userTeam.length >= 3}
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

      {/* Game Rules Summary */}
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
              <li>• Budget: €100.000</li>
              <li>• Maximaal 3 transfers na start</li>
              <li>• Geen transfers in het weekend</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
