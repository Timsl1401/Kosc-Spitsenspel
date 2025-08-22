import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../lib/supabase';
import { Shield, Users, Target, AlertTriangle, Plus, Edit, Trash2, Save, X, Calendar, MessageSquare } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  price: number;
  goals: number;
  created_at: string;
}

interface SuspiciousActivity {
  id: string;
  user_email: string;
  action: string;
  details: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, loading } = useAdmin();
  const [players, setPlayers] = useState<Player[]>([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'goals' | 'dates' | 'feedback' | 'monitoring'>('players');
  
  // Player management states
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    position: '',
    price: 0,
    goals: 0
  });
  
  // Goals management states
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [goalsToAdd, setGoalsToAdd] = useState(0);
  const [matchDate, setMatchDate] = useState('');
  const [matchType, setMatchType] = useState<'competition' | 'friendly'>('competition');

  // Date management states
  const [gameSettings, setGameSettings] = useState<{
    start_deadline: string;
    season_start: string;
    season_end: string;
    transfer_window_open: string;
    transfer_window_close: string;
  }>({
    start_deadline: '',
    season_start: '',
    season_end: '',
    transfer_window_open: '',
    transfer_window_close: ''
  });

  // Feedback states
  const [feedback, setFeedback] = useState<Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    rating: number;
    created_at: string;
  }>>([]);

  useEffect(() => {
    if (isAdmin) {
      loadPlayers();
      loadSuspiciousActivities();
      loadGameSettings();
      loadFeedback();
    }
  }, [isAdmin]);

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('team', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const loadSuspiciousActivities = async () => {
    try {
      // This would come from a suspicious_activities table
      // For now, we'll simulate some data
      const mockActivities: SuspiciousActivity[] = [
        {
          id: '1',
          user_email: 'user@example.com',
          action: 'Multiple transfers in short time',
          details: 'User made 5 transfers within 1 hour',
          timestamp: new Date().toISOString(),
          severity: 'medium'
        }
      ];
      setSuspiciousActivities(mockActivities);
    } catch (error) {
      console.error('Error loading suspicious activities:', error);
    }
  };

  const addPlayer = async () => {
    try {
      const { error } = await supabase
        .from('players')
        .insert([newPlayer]);

      if (error) throw error;

      // Reset form and reload
      setNewPlayer({ name: '', team: '', position: '', price: 0, goals: 0 });
      await loadPlayers();
      alert('Speler succesvol toegevoegd!');
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Fout bij toevoegen speler');
    }
  };

  const updatePlayer = async () => {
    if (!editingPlayer) return;

    try {
      const { error } = await supabase
        .from('players')
        .update({
          name: editingPlayer.name,
          team: editingPlayer.team,
          position: editingPlayer.position,
          price: editingPlayer.price,
          goals: editingPlayer.goals
        })
        .eq('id', editingPlayer.id);

      if (error) throw error;

      setEditingPlayer(null);
      await loadPlayers();
      alert('Speler succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Fout bij bijwerken speler');
    }
  };

  const deletePlayer = async (playerId: string) => {
    if (!confirm('Weet je zeker dat je deze speler wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      await loadPlayers();
      alert('Speler succesvol verwijderd!');
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Fout bij verwijderen speler');
    }
  };

  const addGoals = async () => {
    if (!selectedPlayer || goalsToAdd <= 0) {
      alert('Selecteer een speler en voer aantal doelpunten in');
      return;
    }

    try {
      const player = players.find(p => p.id === selectedPlayer);
      if (!player) throw new Error('Speler niet gevonden');

      const { error } = await supabase
        .from('players')
        .update({ goals: player.goals + goalsToAdd })
        .eq('id', selectedPlayer);

      if (error) throw error;

      // Log the goal addition for monitoring
      await logGoalAddition(player.name, goalsToAdd, matchDate, matchType);

      // Reset form and reload
      setSelectedPlayer('');
      setGoalsToAdd(0);
      setMatchDate('');
      await loadPlayers();
      alert(`${goalsToAdd} doelpunt(en) toegevoegd aan ${player.name}!`);
    } catch (error) {
      console.error('Error adding goals:', error);
      alert('Fout bij toevoegen doelpunten');
    }
  };

  const logGoalAddition = async (playerName: string, goals: number, date: string, type: string) => {
    try {
      // This would log to a goals_log table for monitoring
      console.log(`Goals added: ${playerName} +${goals} on ${date} (${type})`);
    } catch (error) {
      console.error('Error logging goal addition:', error);
    }
  };

  const loadGameSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .select('*');

      if (error) throw error;

      const settings: any = {};
      data?.forEach(setting => {
        settings[setting.key] = setting.value;
      });

      setGameSettings({
        start_deadline: settings.start_deadline || '',
        season_start: settings.season_start || '',
        season_end: settings.season_end || '',
        transfer_window_open: settings.transfer_window_open || '',
        transfer_window_close: settings.transfer_window_close || ''
      });
    } catch (error) {
      console.error('Error loading game settings:', error);
    }
  };

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const updateGameSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('game_settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) throw error;

      await loadGameSettings();
      alert('Instelling succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating game setting:', error);
      alert('Fout bij bijwerken instelling');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Admin rechten controleren...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Toegang Geweigerd</h2>
          <p className="text-gray-600">Je hebt geen admin rechten voor deze pagina.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Beheer spelers, doelpunten en monitor verdachte activiteiten</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="text-green-600 font-semibold">Admin</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('players')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'players'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Spelers Beheren
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'goals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target className="inline-block w-4 h-4 mr-2" />
                Doelpunten Toevoegen
              </button>
                               <button
                   onClick={() => setActiveTab('dates')}
                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
                     activeTab === 'dates'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <Calendar className="inline-block w-4 h-4 mr-2" />
                   Datums
                 </button>
                 <button
                   onClick={() => setActiveTab('feedback')}
                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
                     activeTab === 'feedback'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <MessageSquare className="inline-block w-4 h-4 mr-2" />
                   Feedback
                 </button>
                 <button
                   onClick={() => setActiveTab('monitoring')}
                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
                     activeTab === 'monitoring'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <AlertTriangle className="inline-block w-4 h-4 mr-2" />
                   Monitoring
                 </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'players' && (
          <div className="space-y-6">
            {/* Add New Player */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nieuwe Speler Toevoegen</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Naam"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                  value={newPlayer.team}
                  onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Selecteer Team</option>
                  <option value="KOSC 1">KOSC 1</option>
                  <option value="KOSC 2">KOSC 2</option>
                  <option value="KOSC 3">KOSC 3</option>
                  <option value="KOSC 4">KOSC 4</option>
                  <option value="KOSC 5">KOSC 5</option>
                  <option value="KOSC 6">KOSC 6</option>
                  <option value="KOSC 7">KOSC 7</option>
                  <option value="KOSC 8">KOSC 8</option>
                </select>
                <select
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Selecteer Positie</option>
                  <option value="Aanvaller">Aanvaller</option>
                  <option value="Middenvelder">Middenvelder</option>
                  <option value="Verdediger">Verdediger</option>
                  <option value="Keeper">Keeper</option>
                </select>
                <input
                  type="number"
                  placeholder="Prijs (€)"
                  value={newPlayer.price}
                  onChange={(e) => setNewPlayer({ ...newPlayer, price: parseInt(e.target.value) || 0 })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <button
                  onClick={addPlayer}
                  disabled={!newPlayer.name || !newPlayer.team || !newPlayer.position || newPlayer.price <= 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Toevoegen
                </button>
              </div>
            </div>

            {/* Players List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Alle Spelers ({players.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prijs</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doelpunten</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPlayer?.id === player.id ? (
                            <input
                              type="text"
                              value={editingPlayer.name}
                              onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPlayer?.id === player.id ? (
                            <select
                              value={editingPlayer.team}
                              onChange={(e) => setEditingPlayer({ ...editingPlayer, team: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="KOSC 1">KOSC 1</option>
                              <option value="KOSC 2">KOSC 2</option>
                              <option value="KOSC 3">KOSC 3</option>
                              <option value="KOSC 4">KOSC 4</option>
                              <option value="KOSC 5">KOSC 5</option>
                              <option value="KOSC 6">KOSC 6</option>
                              <option value="KOSC 7">KOSC 7</option>
                              <option value="KOSC 8">KOSC 8</option>
                            </select>
                          ) : (
                            <div className="text-sm text-gray-900">{player.team}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPlayer?.id === player.id ? (
                            <select
                              value={editingPlayer.position}
                              onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="Aanvaller">Aanvaller</option>
                              <option value="Middenvelder">Middenvelder</option>
                              <option value="Verdediger">Verdediger</option>
                              <option value="Keeper">Keeper</option>
                            </select>
                          ) : (
                            <div className="text-sm text-gray-900">{player.position}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPlayer?.id === player.id ? (
                            <input
                              type="number"
                              value={editingPlayer.price}
                              onChange={(e) => setEditingPlayer({ ...editingPlayer, price: parseInt(e.target.value) || 0 })}
                              className="border border-gray-300 rounded px-2 py-1 w-20"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">€{player.price.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingPlayer?.id === player.id ? (
                            <input
                              type="number"
                              value={editingPlayer.goals}
                              onChange={(e) => setEditingPlayer({ ...editingPlayer, goals: parseInt(e.target.value) || 0 })}
                              className="border border-gray-300 rounded px-2 py-1 w-16"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{player.goals}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingPlayer?.id === player.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={updatePlayer}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingPlayer(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingPlayer(player)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePlayer(player.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {/* Add Goals */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Doelpunten Toevoegen</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Selecteer Speler</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.team})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Aantal doelpunten"
                  value={goalsToAdd}
                  onChange={(e) => setGoalsToAdd(parseInt(e.target.value) || 0)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value as 'competition' | 'friendly')}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="competition">Competitie</option>
                  <option value="friendly">Vriendschappelijk</option>
                </select>
                <button
                  onClick={addGoals}
                  disabled={!selectedPlayer || goalsToAdd <= 0 || !matchDate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Doelpunten Toevoegen
                </button>
              </div>
            </div>

            {/* Goals Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Doelpunten Overzicht</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {players.reduce((sum, p) => sum + p.goals, 0)}
                  </div>
                  <div className="text-green-800">Totaal Doelpunten</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {players.filter(p => p.goals > 0).length}
                  </div>
                  <div className="text-blue-800">Spelers met Doelpunten</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {players.reduce((max, p) => Math.max(max, p.goals), 0)}
                  </div>
                  <div className="text-yellow-800">Hoogste Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.goals, 0) / players.length * 10) / 10 : 0}
                  </div>
                  <div className="text-purple-800">Gemiddelde per Speler</div>
                </div>
              </div>
            </div>
          </div>
        )}

                 {activeTab === 'dates' && (
           <div className="space-y-6">
             {/* Game Settings Management */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Game Instellingen</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Transfer Deadline
                     </label>
                     <div className="flex space-x-2">
                       <input
                         type="date"
                         value={gameSettings.start_deadline}
                         onChange={(e) => setGameSettings({ ...gameSettings, start_deadline: e.target.value })}
                         className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                       />
                       <button
                         onClick={() => updateGameSetting('start_deadline', gameSettings.start_deadline)}
                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                       >
                         Opslaan
                       </button>
                     </div>
                     <p className="text-sm text-gray-500 mt-1">
                       Na deze datum kunnen spelers alleen nog 3 transfers maken
                     </p>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Seizoen Start
                     </label>
                     <div className="flex space-x-2">
                       <input
                         type="date"
                         value={gameSettings.season_start}
                         onChange={(e) => setGameSettings({ ...gameSettings, season_start: e.target.value })}
                         className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                       />
                       <button
                         onClick={() => updateGameSetting('season_start', gameSettings.season_start)}
                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                       >
                         Opslaan
                       </button>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Seizoen Einde
                     </label>
                     <div className="flex space-x-2">
                       <input
                         type="date"
                         value={gameSettings.season_end}
                         onChange={(e) => setGameSettings({ ...gameSettings, season_end: e.target.value })}
                         className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                       />
                       <button
                         onClick={() => updateGameSetting('season_end', gameSettings.season_end)}
                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                       >
                         Opslaan
                       </button>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Transfer Venster Open
                     </label>
                     <div className="flex space-x-2">
                       <input
                         type="date"
                         value={gameSettings.transfer_window_open}
                         onChange={(e) => setGameSettings({ ...gameSettings, transfer_window_open: e.target.value })}
                         className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                       />
                       <button
                         onClick={() => updateGameSetting('transfer_window_open', gameSettings.transfer_window_open)}
                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                       >
                         Opslaan
                       </button>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Transfer Venster Sluit
                     </label>
                     <div className="flex space-x-2">
                       <input
                         type="date"
                         value={gameSettings.transfer_window_close}
                         onChange={(e) => setGameSettings({ ...gameSettings, transfer_window_close: e.target.value })}
                         className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                       />
                       <button
                         onClick={() => updateGameSetting('transfer_window_close', gameSettings.transfer_window_close)}
                         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                       >
                         Opslaan
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Current Status */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Huidige Status</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="text-center p-4 bg-blue-50 rounded-lg">
                   <div className="text-lg font-semibold text-blue-800">
                     {gameSettings.start_deadline ? new Date(gameSettings.start_deadline).toLocaleDateString('nl-NL') : 'Niet ingesteld'}
                   </div>
                   <div className="text-blue-600">Transfer Deadline</div>
                 </div>
                 <div className="text-center p-4 bg-green-50 rounded-lg">
                   <div className="text-lg font-semibold text-green-800">
                     {gameSettings.season_start ? new Date(gameSettings.season_start).toLocaleDateString('nl-NL') : 'Niet ingesteld'}
                   </div>
                   <div className="text-green-600">Seizoen Start</div>
                 </div>
                 <div className="text-center p-4 bg-purple-50 rounded-lg">
                   <div className="text-lg font-semibold text-purple-800">
                     {gameSettings.season_end ? new Date(gameSettings.season_end).toLocaleDateString('nl-NL') : 'Niet ingesteld'}
                   </div>
                   <div className="text-purple-600">Seizoen Einde</div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'feedback' && (
           <div className="space-y-6">
             {/* Feedback Overview */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback Overzicht ({feedback.length})</h2>
               {feedback.length === 0 ? (
                 <div className="text-center py-8 text-gray-500">
                   <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                   <p>Nog geen feedback ontvangen</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {feedback.map((item) => (
                     <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                       <div className="flex items-start justify-between">
                         <div className="flex-1">
                           <div className="flex items-center space-x-3 mb-2">
                             <h3 className="text-lg font-semibold text-gray-900">{item.subject}</h3>
                             <div className="flex items-center space-x-1">
                               {[...Array(5)].map((_, i) => (
                                 <span
                                   key={i}
                                   className={`text-lg ${
                                     i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                   }`}
                                 >
                                   ★
                                 </span>
                               ))}
                             </div>
                           </div>
                           <div className="text-sm text-gray-600 mb-2">
                             <strong>Van:</strong> {item.name} ({item.email})
                           </div>
                           <div className="text-gray-800 mb-2">{item.message}</div>
                           <div className="text-xs text-gray-500">
                             {new Date(item.created_at).toLocaleString('nl-NL')}
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>

             {/* Feedback Statistics */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback Statistieken</h2>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="text-center p-4 bg-blue-50 rounded-lg">
                   <div className="text-2xl font-bold text-blue-600">{feedback.length}</div>
                   <div className="text-blue-800">Totaal Feedback</div>
                 </div>
                 <div className="text-center p-4 bg-green-50 rounded-lg">
                   <div className="text-2xl font-bold text-green-600">
                     {feedback.length > 0 ? Math.round(feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length * 10) / 10 : 0}
                   </div>
                   <div className="text-green-800">Gemiddelde Rating</div>
                 </div>
                 <div className="text-center p-4 bg-yellow-50 rounded-lg">
                   <div className="text-2xl font-bold text-yellow-600">
                     {feedback.filter(item => item.rating >= 4).length}
                   </div>
                   <div className="text-yellow-800">Positieve Reviews (4-5★)</div>
                 </div>
                 <div className="text-center p-4 bg-red-50 rounded-lg">
                   <div className="text-2xl font-bold text-red-600">
                     {feedback.filter(item => item.rating <= 2).length}
                   </div>
                   <div className="text-red-800">Negatieve Reviews (1-2★)</div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* Suspicious Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Verdachte Activiteiten</h2>
              {suspiciousActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Geen verdachte activiteiten gedetecteerd</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suspiciousActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-lg border ${
                        activity.severity === 'high'
                          ? 'bg-red-50 border-red-200'
                          : activity.severity === 'medium'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{activity.action}</div>
                          <div className="text-sm text-gray-600">{activity.details}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.user_email} • {new Date(activity.timestamp).toLocaleString('nl-NL')}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            activity.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : activity.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {activity.severity === 'high' ? 'Hoog' : activity.severity === 'medium' ? 'Medium' : 'Laag'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Systeem Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-green-800">Database Verbinding</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-green-800">Admin Rechten</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-green-800">Monitoring Actief</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
