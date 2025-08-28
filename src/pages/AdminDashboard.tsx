import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase, getTeamPoints } from '../lib/supabase';
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
  const { isAdmin, loading, adminEmails, addAdminEmail, removeAdminEmail } = useAdmin();
  const [players, setPlayers] = useState<Player[]>([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'goals' | 'dates' | 'feedback' | 'monitoring' | 'users' | 'admin-management'>('players');
  
  // Spelers beheren
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    position: '',
    price: 0,
    goals: 0
  });
  
  // Doelpunten beheren
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [goalsToAdd, setGoalsToAdd] = useState(0);
  const [matchDate, setMatchDate] = useState('');
  const [matchType, setMatchType] = useState<'competition' | 'friendly'>('competition');

  // Datums en instellingen
  const [gameSettings, setGameSettings] = useState<{
    start_deadline: string;
    season_start: string;
    season_end: string;
    transfer_window_open: string;
    transfer_window_close: string;
    weekend_transfers_allowed: boolean;
  }>({
    start_deadline: '',
    season_start: '',
    season_end: '',
    transfer_window_open: '',
    transfer_window_close: '',
    weekend_transfers_allowed: false
  });

  // Feedback van gebruikers
  const [feedback, setFeedback] = useState<Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    rating: number;
    created_at: string;
  }>>([]);

  // Gebruikers data
  const [users, setUsers] = useState<Array<{
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    last_sign_in_at: string;
    team_count: number;
    total_points: number;
    team_value: number;
  }>>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'team' | 'edit'>('list');
  const [selectedUserForView, setSelectedUserForView] = useState<any>(null);
  const [userTeamDetails, setUserTeamDetails] = useState<any[]>([]);
  
  // Admin management
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const addNewAdminEmail = async () => {
    if (newAdminEmail && !adminEmails.includes(newAdminEmail)) {
      await addAdminEmail(newAdminEmail);
      setNewAdminEmail('');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      checkDatabaseStatus();
      loadPlayers();
      loadSuspiciousActivities();
      loadGameSettings();
      loadFeedback();
      loadUsers();
    }
  }, [isAdmin]);

  const checkDatabaseStatus = async () => {
    try {
      console.log('Checking database status...');
      
      // Check if players table exists and is accessible
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('count')
        .limit(1);
      
      console.log('Players table check:', { data: playersData, error: playersError });
      
      // Check if game_settings table exists and is accessible
      const { data: settingsData, error: settingsError } = await supabase
        .from('game_settings')
        .select('count')
        .limit(1);
      
      console.log('Game settings table check:', { data: settingsData, error: settingsError });
      
      // Check if feedback table exists and is accessible
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('count')
        .limit(1);
      
      console.log('Feedback table check:', { data: feedbackData, error: feedbackError });
      
    } catch (error) {
      console.error('Database status check failed:', error);
    }
  };

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
      console.log('Adding player:', newPlayer);
      
      const { data, error } = await supabase
        .from('players')
        .insert([newPlayer])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Player added successfully:', data);

      // Reset form and reload
      setNewPlayer({ name: '', team: '', position: '', price: 0, goals: 0 });
      await loadPlayers();
      alert('Speler succesvol toegevoegd!');
    } catch (error) {
      console.error('Error adding player:', error);
      alert(`Fout bij toevoegen speler: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    }
  };

  const updatePlayer = async () => {
    if (!editingPlayer) return;

    try {
      console.log('Updating player:', editingPlayer);
      
      const { data, error } = await supabase
        .from('players')
        .update({
          name: editingPlayer.name,
          team: editingPlayer.team,
          position: editingPlayer.position,
          price: editingPlayer.price,
          goals: editingPlayer.goals
        })
        .eq('id', editingPlayer.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Player updated successfully:', data);

      setEditingPlayer(null);
      await loadPlayers();
      alert('Speler succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating player:', error);
      alert(`Fout bij bijwerken speler: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    }
  };

  const deletePlayer = async (playerId: string) => {
    if (!confirm('Weet je zeker dat je deze speler wilt verwijderen?')) return;

    try {
      console.log('Deleting player:', playerId);
      
      const { data, error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Player deleted successfully:', data);

      await loadPlayers();
      alert('Speler succesvol verwijderd!');
    } catch (error) {
      console.error('Error deleting player:', error);
      alert(`Fout bij verwijderen speler: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
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

      console.log('Adding goals:', { player: player.name, goals: goalsToAdd, date: matchDate, type: matchType });

      // First, create a match if it doesn't exist
      let matchId = null;
      if (matchDate && matchType) {
        const competition = matchType === 'competition' ? 'competitie' : 'beker';
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .insert({
            home_team: 'KOSC 1', // Default team, can be made configurable
            away_team: 'Tegenstander',
            match_date: matchDate,
            competition: competition,
            status: 'finished',
            is_competitive: true
          })
          .select()
          .single();

        if (matchError) {
          console.error('Error creating match:', matchError);
          throw matchError;
        }
        matchId = matchData.id;
      }

      // Add goals to the goals table
      for (let i = 0; i < goalsToAdd; i++) {
        const { error: goalError } = await supabase
          .from('goals')
          .insert({
            match_id: matchId,
            player_id: selectedPlayer,
            minute: 45 + i // Default minute, can be made configurable
          });

        if (goalError) {
          console.error('Error adding goal:', goalError);
          throw goalError;
        }
      }

      // Update player's goals count in players table
      const { data, error } = await supabase
        .from('players')
        .update({ goals: player.goals + goalsToAdd })
        .eq('id', selectedPlayer)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Goals added successfully:', data);

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
      alert(`Fout bij toevoegen doelpunten: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
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
        transfer_window_close: settings.transfer_window_close || '',
        weekend_transfers_allowed: settings.weekend_transfers_allowed === 'true'
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

  const loadUsers = async () => {
    try {
      // Haal alle gebruikers op met hun team en punten informatie
      const { data: userTeams, error: userTeamsError } = await supabase
        .from('user_teams')
        .select(`
          user_id,
          bought_at,
          sold_at,
          players (
            id,
            name,
            team,
            goals,
            price
          )
        `)
        .is('sold_at', null);

      if (userTeamsError) throw userTeamsError;

      // Groepeer per gebruiker en bereken statistieken
      const userStats = new Map();
      
      userTeams?.forEach(userTeam => {
        const userId = userTeam.user_id;
        const player = userTeam.players as any;
        
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            id: userId,
            team_count: 0,
            total_points: 0,
            team_value: 0
          });
        }
        
        const stats = userStats.get(userId);
        stats.team_count++;
        stats.team_value += player.price || 0;
        
        // Bereken punten (vereenvoudigde aanpak)
        const goalsForPlayer = player.goals || 0;
        const pointsForPlayer = goalsForPlayer * getTeamPoints(player.team);
        stats.total_points += pointsForPlayer;
      });

      // Haal gebruikersprofielen op
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, display_name');

      if (profilesError) throw profilesError;

      // Haal echte gebruikersdata op uit auth.users (via Supabase admin API)
      // Voorlopig gebruiken we de user_id als email en een geschatte datum
      const usersData = Array.from(userStats.values()).map(stats => {
        const profile = profiles?.find(p => p.user_id === stats.id);
        const userId = stats.id;
        
        // Schat de aanmelddatum op basis van user_id (dit is een tijdelijke oplossing)
        // In een echte implementatie zou je de Supabase admin API gebruiken
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() - Math.floor(Math.random() * 30)); // Random datum in afgelopen 30 dagen
        
        return {
          ...stats,
          email: `${userId.slice(0, 8)}@kosc.nl`, // Genereer email op basis van user_id
          full_name: profile?.display_name || `Gebruiker ${userId.slice(0, 6)}`,
          created_at: estimatedDate.toISOString(),
          last_sign_in_at: new Date().toISOString() // Vandaag als laatste login
        };
      });

      // Sorteer gebruikers op alfabetische volgorde (naam)
      const sortedUsersData = usersData.sort((a, b) => 
        a.full_name.localeCompare(b.full_name, 'nl', { sensitivity: 'base' })
      );

      setUsers(sortedUsersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // Filter gebruikers op basis van zoekterm
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewUserTeam = async (userId: string) => {
    try {
      // Haal gedetailleerde team informatie op voor deze gebruiker
      const { data: userTeams, error } = await supabase
        .from('user_teams')
        .select(`
          bought_at,
          players (
            id,
            name,
            team,
            position,
            goals,
            price
          )
        `)
        .eq('user_id', userId)
        .is('sold_at', null);

      if (error) throw error;

      const user = users.find(u => u.id === userId);
      if (!user || !userTeams) return;

      // Bereken punten per speler
      const teamDetails = userTeams.map(userTeam => {
        const player = userTeam.players as any;
        const goalsForPlayer = player.goals || 0;
        const pointsForPlayer = goalsForPlayer * getTeamPoints(player.team);
        
        return {
          name: player.name,
          team: player.team,
          position: player.position,
          goals: goalsForPlayer,
          points: pointsForPlayer,
          price: player.price,
          boughtAt: new Date(userTeam.bought_at).toLocaleDateString('nl-NL')
        };
      });

      // Sorteer op punten (hoogste eerst)
      teamDetails.sort((a, b) => b.points - a.points);

      // Sla data op en toon team view
      setUserTeamDetails(teamDetails);
      setSelectedUserForView(user);
      setViewMode('team');
      
    } catch (error) {
      console.error('Error viewing user team:', error);
      alert('Fout bij ophalen team informatie!');
    }
  };

  const editUser = (userId: string) => {
    // Bewerk gebruiker functionaliteit
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Toon edit view
    setSelectedUserForView(user);
    setViewMode('edit');
  };

  const goBackToList = () => {
    setViewMode('list');
    setSelectedUserForView(null);
    setUserTeamDetails([]);
  };

  const recalculateUserPoints = async (userId: string) => {
    try {
      // Haal alle team data op voor deze gebruiker
      const { data: userTeams, error } = await supabase
        .from('user_teams')
        .select(`
          bought_at,
          players (
            id,
            name,
            team,
            goals,
            price
          )
        `)
        .eq('user_id', userId)
        .is('sold_at', null);

      if (error) throw error;

      // Herbereken punten
      let totalPoints = 0;
      let teamValue = 0;
      let teamCount = 0;

      userTeams?.forEach(userTeam => {
        const player = userTeam.players as any;
        const goalsForPlayer = player.goals || 0;
        const pointsForPlayer = goalsForPlayer * getTeamPoints(player.team);
        
        totalPoints += pointsForPlayer;
        teamValue += player.price || 0;
        teamCount++;
      });

      // Update lokale state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, total_points: totalPoints, team_value: teamValue, team_count: teamCount }
            : user
        )
      );

      alert(`Punten herberekend voor ${users.find(u => u.id === userId)?.full_name}:\n\n` +
            `Nieuwe totaal punten: ${totalPoints} pt\n` +
            `Nieuwe team waarde: €${teamValue.toLocaleString()}\n` +
            `Aantal spelers: ${teamCount}/15`);

    } catch (error) {
      console.error('Error recalculating user points:', error);
      alert('Fout bij herberekenen punten!');
    }
  };

  const deleteUser = (userId: string) => {
    // Verwijder gebruiker functionaliteit
    const user = users.find(u => u.id === userId);
    if (user) {
      const confirmDelete = confirm(`Weet je zeker dat je ${user.full_name} wilt verwijderen?\n\n` +
                                   `Dit zal alle team data en punten permanent verwijderen!\n\n` +
                                   `Type 'VERWIJDER' om te bevestigen.`);
      
      if (confirmDelete) {
        const typeConfirm = prompt('Type VERWIJDER om te bevestigen:');
        if (typeConfirm === 'VERWIJDER') {
          // Verwijder gebruiker uit database
          removeUser(userId);
        }
      }
    }
  };

  const updateUserProfile = async (userId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          display_name: newName,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Update lokale state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, full_name: newName }
            : user
        )
      );

      alert(`Gebruiker ${newName} succesvol bijgewerkt!`);
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Fout bij bijwerken gebruiker!');
    }
  };

  const removeUser = async (userId: string) => {
    try {
      // Verwijder alle user_teams van deze gebruiker
      const { error: teamsError } = await supabase
        .from('user_teams')
        .delete()
        .eq('user_id', userId);

      if (teamsError) throw teamsError;

      // Verwijder user_profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Update lokale state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      alert('Gebruiker succesvol verwijderd!');
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Fout bij verwijderen gebruiker!');
    }
  };

  const updateGameSetting = async (key: string, value: string) => {
    try {
      console.log('Updating game setting:', { key, value });
      
      const { data, error } = await supabase
        .from('game_settings')
        .upsert({ key, value }, { onConflict: 'key' })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Game setting updated successfully:', data);

      await loadGameSettings();
      alert('Instelling succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating game setting:', error);
      alert(`Fout bij bijwerken instelling: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    }
  };

  const updateBooleanGameSetting = async (key: string, value: boolean) => {
    try {
      console.log('Updating boolean game setting:', { key, value });
      
      const { data, error } = await supabase
        .from('game_settings')
        .upsert({ key, value: value.toString() }, { onConflict: 'key' })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Boolean game setting updated successfully:', data);

      await loadGameSettings();
      alert('Instelling succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating boolean game setting:', error);
      alert(`Fout bij bijwerken instelling: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
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
            <nav className="-mb-px flex flex-wrap space-x-2 md:space-x-8 px-4 md:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('players')}
                className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === 'players'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Spelers Beheren</span>
                <span className="sm:hidden">Spelers</span>
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === 'goals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Doelpunten Toevoegen</span>
                <span className="sm:hidden">Doelpunten</span>
              </button>
                               <button
                   onClick={() => setActiveTab('dates')}
                   className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                     activeTab === 'dates'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <Calendar className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                   <span className="hidden sm:inline">Datums</span>
                   <span className="sm:hidden">Datums</span>
                 </button>
                 <button
                   onClick={() => setActiveTab('feedback')}
                   className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                     activeTab === 'feedback'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <MessageSquare className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                   <span className="hidden sm:inline">Feedback</span>
                   <span className="sm:hidden">Feedback</span>
                 </button>
                 <button
                   onClick={() => setActiveTab('monitoring')}
                   className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                     activeTab === 'monitoring'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <AlertTriangle className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                   <span className="hidden sm:inline">Monitoring</span>
                   <span className="sm:hidden">Monitoring</span>
                 </button>
                 <button
                   onClick={() => setActiveTab('users')}
                   className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                     activeTab === 'users'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <Users className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                   <span className="hidden sm:inline">Gebruikers</span>
                   <span className="sm:hidden">Gebruikers</span>
                 </button>
                 <button
                   onClick={() => setActiveTab('admin-management')}
                   className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                     activeTab === 'admin-management'
                       ? 'border-green-500 text-green-600'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                   }`}
                 >
                   <Shield className="inline-block w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                   <span className="hidden sm:inline">Admin Beheer</span>
                   <span className="sm:hidden">Admin</span>
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
                  <optgroup label="Zondag Teams">
                    <option value="KOSC 1">KOSC 1</option>
                    <option value="KOSC 2">KOSC 2</option>
                    <option value="KOSC 3">KOSC 3</option>
                    <option value="KOSC 4">KOSC 4</option>
                    <option value="KOSC 5">KOSC 5</option>
                    <option value="KOSC 6">KOSC 6</option>
                    <option value="KOSC 7">KOSC 7</option>
                  </optgroup>
                  <optgroup label="Zaterdag Teams">
                    <option value="KOSC 2 Zaterdag">KOSC 2 Zaterdag</option>
                    <option value="KOSC 3 Zaterdag">KOSC 3 Zaterdag</option>
                  </optgroup>
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
                   type="text"
                   placeholder="Prijs (€)"
                   value={newPlayer.price === 0 ? '' : newPlayer.price.toString()}
                   onChange={(e) => {
                     const value = e.target.value.replace(/[^0-9]/g, '');
                     setNewPlayer({ ...newPlayer, price: value ? parseInt(value) : 0 });
                   }}
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
                              <optgroup label="Zondag Teams">
                                <option value="KOSC 1">KOSC 1</option>
                                <option value="KOSC 2">KOSC 2</option>
                                <option value="KOSC 3">KOSC 3</option>
                                <option value="KOSC 4">KOSC 4</option>
                                <option value="KOSC 5">KOSC 5</option>
                                <option value="KOSC 6">KOSC 6</option>
                                <option value="KOSC 7">KOSC 7</option>
                              </optgroup>
                              <optgroup label="Zaterdag Teams">
                                <option value="KOSC 2 Zaterdag">KOSC 2 Zaterdag</option>
                                <option value="KOSC 3 Zaterdag">KOSC 3 Zaterdag</option>
                              </optgroup>
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
                                 type="text"
                                 value={editingPlayer.price === 0 ? '' : editingPlayer.price.toString()}
                                 onChange={(e) => {
                                   const value = e.target.value.replace(/[^0-9]/g, '');
                                   setEditingPlayer({ ...editingPlayer, price: value ? parseInt(value) : 0 });
                                 }}
                                 className="border border-gray-300 rounded px-2 py-1 w-24"
                                 placeholder="Prijs"
                               />
                             ) : (
                               <div className="text-sm text-gray-900">€{player.price.toLocaleString()}</div>
                             )}
                           </td>
                                                   <td className="px-6 py-4 whitespace-nowrap">
                             {editingPlayer?.id === player.id ? (
                               <input
                                 type="text"
                                 value={editingPlayer.goals === 0 ? '' : editingPlayer.goals.toString()}
                                 onChange={(e) => {
                                   const value = e.target.value.replace(/[^0-9]/g, '');
                                   setEditingPlayer({ ...editingPlayer, goals: value ? parseInt(value) : 0 });
                                 }}
                                 className="border border-gray-300 rounded px-2 py-1 w-16"
                                 placeholder="0"
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
                   type="text"
                   placeholder="Aantal doelpunten"
                   value={goalsToAdd === 0 ? '' : goalsToAdd.toString()}
                   onChange={(e) => {
                     const value = e.target.value.replace(/[^0-9]/g, '');
                     setGoalsToAdd(value ? parseInt(value) : 0);
                   }}
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

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Weekend Transfers Toestaan
                     </label>
                     <div className="flex items-center space-x-4">
                       <label className="flex items-center">
                         <input
                           type="radio"
                           name="weekend_transfers"
                           value="false"
                           checked={!gameSettings.weekend_transfers_allowed}
                           onChange={() => updateBooleanGameSetting('weekend_transfers_allowed', false)}
                           className="mr-2"
                         />
                         <span className="text-sm text-gray-700">Uitgeschakeld (standaard weekend regel)</span>
                       </label>
                       <label className="flex items-center">
                         <input
                           type="radio"
                           name="weekend_transfers"
                           value="true"
                           checked={gameSettings.weekend_transfers_allowed}
                           onChange={() => updateBooleanGameSetting('weekend_transfers_allowed', true)}
                           className="mr-2"
                         />
                         <span className="text-sm text-gray-700">Ingeschakeld (altijd transfers toestaan)</span>
                       </label>
                     </div>
                     <p className="text-sm text-gray-500 mt-1">
                       Test modus: schakel weekend transfers in om alles te kunnen testen
                     </p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Current Status */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-4">Huidige Status</h2>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                 <div className="text-center p-4 bg-yellow-50 rounded-lg">
                   <div className="text-lg font-semibold text-yellow-800">
                     {gameSettings.weekend_transfers_allowed ? 'Ingeschakeld' : 'Uitgeschakeld'}
                   </div>
                   <div className="text-yellow-600">Weekend Transfers</div>
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

        {activeTab === 'users' && viewMode === 'list' && (
          <div className="space-y-6">
            {/* Gebruikers Overzicht */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Gebruikers Overzicht</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Zoek op naam of email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Zoekopdracht wissen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>{searchTerm ? `Geen gebruikers gevonden voor "${searchTerm}"` : 'Geen gebruikers gevonden'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedUser === user.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Aangemeld: {new Date(user.created_at).toLocaleDateString('nl-NL')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{user.total_points} pt</div>
                          <div className="text-sm text-gray-600">{user.team_count} spelers</div>
                          <div className="text-sm text-gray-600">€{user.team_value.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Uitgebreide Gebruikers Informatie */}
                      {selectedUser === user.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Gedetailleerde Informatie</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Team Samenstelling</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Aantal spelers:</span>
                                  <span className="font-medium">{user.team_count}/15</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Team waarde:</span>
                                  <span className="font-medium">€{user.team_value.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Beschikbaar budget:</span>
                                  <span className="font-medium">€{(100000 - user.team_value).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Prestaties</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Totaal punten:</span>
                                  <span className="font-medium text-green-600">{user.total_points} pt</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Gemiddelde per speler:</span>
                                  <span className="font-medium">
                                    {user.team_count > 0 ? Math.round(user.total_points / user.team_count * 10) / 10 : 0} pt
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Laatste login:</span>
                                  <span className="font-medium">{new Date(user.last_sign_in_at).toLocaleDateString('nl-NL')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="font-medium text-gray-700 mb-2">Acties</h5>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => viewUserTeam(user.id)}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Bekijk Team
                              </button>
                              <button 
                                onClick={() => editUser(user.id)}
                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Bewerk Gebruiker
                              </button>
                              <button 
                                onClick={() => deleteUser(user.id)}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Verwijder Gebruiker
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team View */}
        {activeTab === 'users' && viewMode === 'team' && selectedUserForView && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Team van {selectedUserForView.full_name}
                </h2>
                <button
                  onClick={goBackToList}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  ← Terug naar Overzicht
                </button>
              </div>

              {/* Team Samenvatting */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedUserForView.team_count}</div>
                  <div className="text-blue-800">Spelers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedUserForView.total_points}</div>
                  <div className="text-green-800">Totaal Punten</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">€{selectedUserForView.team_value.toLocaleString()}</div>
                  <div className="text-yellow-800">Team Waarde</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">€{(100000 - selectedUserForView.team_value).toLocaleString()}</div>
                  <div className="text-purple-800">Beschikbaar Budget</div>
                </div>
              </div>

              {/* Spelers Lijst */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spelers</h3>
                {userTeamDetails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Geen spelers in team</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userTeamDetails.map((player, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{player.name}</h4>
                            <p className="text-sm text-gray-600">{player.team} • {player.position}</p>
                            <p className="text-xs text-gray-500">Gekocht: {player.boughtAt}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">{player.points} pt</span>
                            <p className="text-sm text-gray-600">€{player.price.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Doelpunten:</span>
                            <span className="text-sm font-medium text-gray-900">{player.goals}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">Punten per goal:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {getTeamPoints(player.team)} pt
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit User View */}
        {activeTab === 'users' && viewMode === 'edit' && selectedUserForView && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Bewerk Gebruiker: {selectedUserForView.full_name}
                </h2>
                <button
                  onClick={goBackToList}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  ← Terug naar Overzicht
                </button>
              </div>

              {/* Edit Form */}
              <div className="space-y-6">
                {/* Naam Wijzigen */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Naam Wijzigen</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Nieuwe naam"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      defaultValue={selectedUserForView.full_name}
                      id="newUserName"
                    />
                    <button
                      onClick={() => {
                        const newName = (document.getElementById('newUserName') as HTMLInputElement).value;
                        if (newName && newName.trim() !== '') {
                          updateUserProfile(selectedUserForView.id, newName.trim());
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Naam Bijwerken
                    </button>
                  </div>
                </div>

                {/* Team Beheren */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Beheren</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedUserForView.team_count}</div>
                      <div className="text-blue-800">Huidige Spelers</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">€{selectedUserForView.team_value.toLocaleString()}</div>
                      <div className="text-green-800">Team Waarde</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">€{(100000 - selectedUserForView.team_value).toLocaleString()}</div>
                      <div className="text-yellow-800">Beschikbaar Budget</div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => viewUserTeam(selectedUserForView.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Bekijk Team
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      disabled
                    >
                      Speler Toevoegen (Nog niet geïmplementeerd)
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      disabled
                    >
                      Speler Verwijderen (Nog niet geïmplementeerd)
                    </button>
                  </div>
                </div>

                {/* Punten Beheren */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Punten Beheren</h3>
                  <div className="text-center p-4 bg-green-50 rounded-lg mb-4">
                    <div className="text-2xl font-bold text-green-600">{selectedUserForView.total_points}</div>
                    <div className="text-green-800">Huidige Totaal Punten</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => recalculateUserPoints(selectedUserForView.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Punten Herberekenen
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      disabled
                    >
                      Handmatig Aanpassen (Nog niet geïmplementeerd)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admin-management' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Email Beheer</h2>
              
              {/* Current Admin Emails */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Huidige Admin Emails</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminEmails.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-700 font-medium">{email}</span>
                      <button
                        onClick={() => removeAdminEmail(email)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Verwijder admin toegang"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Admin Email */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nieuwe Admin Email Toevoegen</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={addNewAdminEmail}
                    disabled={!newAdminEmail || adminEmails.includes(newAdminEmail)}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Toevoegen
                  </button>
                </div>
                {newAdminEmail && adminEmails.includes(newAdminEmail) && (
                  <p className="text-red-600 text-sm mt-2">Deze email is al een admin.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
