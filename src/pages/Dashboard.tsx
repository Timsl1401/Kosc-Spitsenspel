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


  useEffect(() => {
    if (user) {
      loadUserData();
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

              // setTeamValue(currentTeamValue); // TODO: Implement team value tracking
      setBudget(100000 - currentTeamValue);

      // Calculate total points
      const points = teamData?.reduce((sum, item) => {
        const player = playersData?.find(p => p.id === item.player_id);
        if (player) {
          return sum + (player.goals * getTeamPoints(player.team));
        }
        return sum;
      }, 0) || 0;

      setTotalPoints(points);

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buyPlayer = async (player: Player) => {
    console.log('Buying player:', player.name, 'User ID:', user?.id);
    
    if (!isTransferAllowed()) {
      alert('Transfers zijn niet toegestaan in het weekend!');
      return;
    }

    if (budget < player.price) {
      alert(`Je hebt niet genoeg budget om deze speler te kopen! Budget: €${budget}, Prijs: €${player.price}`);
      return;
    }

    if (userTeam.length >= 15) {
      alert('Je team is al vol (maximaal 15 spelers)!');
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

      // Reload data
      await loadUserData();
      alert(`${player.name} is toegevoegd aan je team!`);

    } catch (error: any) {
      console.error('Error buying player:', error);
      alert(`Er is een fout opgetreden bij het kopen van de speler: ${error.message || 'Onbekende fout'}`);
    }
  };

  const sellPlayer = async (userTeamItem: UserTeam) => {
    if (!isTransferAllowed()) {
      alert('Transfers zijn niet toegestaan in het weekend!');
      return;
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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kosc-card text-center">
          <div className="flex items-center justify-center mb-3">
            <Trophy className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{totalPoints}</h3>
          <p className="text-gray-600">Totaal Punten</p>
        </div>

        <div className="kosc-card text-center">
          <div className="flex items-center justify-center mb-3">
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{userTeam.length}/15</h3>
          <p className="text-gray-600">Spelers in Team</p>
        </div>

        <div className="kosc-card text-center">
          <div className="flex items-center justify-center mb-3">
            <Euro className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">€{budget.toLocaleString()}</h3>
          <p className="text-gray-600">Beschikbaar Budget</p>
        </div>

        <div className="kosc-card text-center">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
                          <h3 className="text-2xl font-bold text-gray-800">3</h3>
          <p className="text-gray-600">Transfers Over</p>
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

      {/* Current Team */}
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

      {/* Available Players */}
      <div className="kosc-section">
        <h2 className="kosc-title text-2xl mb-6">Beschikbare Spelers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePlayers
            .filter(player => !userTeam.find(ut => ut.player_id === player.id && !ut.sold_at))
            .map((player) => (
              <div key={player.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
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
                    disabled={!isTransferAllowed() || budget < player.price || userTeam.length >= 15}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Koop
                  </button>
                </div>
              </div>
            ))}
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
