// Service voor het ophalen van wedstrijden van voetbal.nl
// Let op: Web scraping kan instabiel zijn door website wijzigingen

export interface VoetbalMatch {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  matchDate: string;
  competition: string;
  status: 'scheduled' | 'live' | 'finished';
  matchUrl?: string;
}

export class VoetbalService {
  private static readonly BASE_URL = 'https://www.voetbal.nl';
  
  // Zoek KOSC teams op voetbal.nl
  static async searchKoscTeams(): Promise<string[]> {
    try {
      // Dit is een placeholder - echte implementatie vereist server-side scraping
      // omdat browsers CORS beperkingen hebben voor externe websites
      console.log('Zoeken naar KOSC teams op voetbal.nl...');
      
      // Voor nu returnen we bekende KOSC teams
      return [
        'KOSC 1',
        'KOSC 2', 
        'KOSC 3',
        'KOSC 4',
        'KOSC 5',
        'KOSC 6',
        'KOSC 7',
        'KOSC 8'
      ];
    } catch (error) {
      console.error('Fout bij zoeken KOSC teams:', error);
      return [];
    }
  }

  // Haal wedstrijden op voor een specifiek team
  static async getTeamMatches(teamName: string): Promise<VoetbalMatch[]> {
    try {
      console.log(`Ophalen wedstrijden voor ${teamName} van voetbal.nl...`);
      
      // Dit is een placeholder - echte implementatie vereist server-side scraping
      // Voor nu returnen we voorbeeld data
      return this.getMockMatches(teamName);
    } catch (error) {
      console.error(`Fout bij ophalen wedstrijden voor ${teamName}:`, error);
      return [];
    }
  }

  // Haal alle KOSC wedstrijden op
  static async getAllKoscMatches(): Promise<VoetbalMatch[]> {
    try {
      const teams = await this.searchKoscTeams();
      const allMatches: VoetbalMatch[] = [];
      
      for (const team of teams) {
        const teamMatches = await this.getTeamMatches(team);
        allMatches.push(...teamMatches);
      }
      
      // Sorteer op datum
      return allMatches.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    } catch (error) {
      console.error('Fout bij ophalen alle KOSC wedstrijden:', error);
      return [];
    }
  }

  // Mock data voor ontwikkeling (vervang dit door echte scraping)
  private static getMockMatches(teamName: string): VoetbalMatch[] {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return [
      {
        homeTeam: teamName,
        awayTeam: 'VV Oldenzaal',
        homeScore: undefined,
        awayScore: undefined,
        matchDate: nextWeek.toISOString(),
        competition: 'Eerste Klasse',
        status: 'scheduled'
      },
      {
        homeTeam: 'VV Losser',
        awayTeam: teamName,
        homeScore: 2,
        awayScore: 1,
        matchDate: today.toISOString(),
        competition: 'Eerste Klasse',
        status: 'finished'
      },
      {
        homeTeam: teamName,
        awayTeam: 'VV Weerselo',
        homeScore: 3,
        awayScore: 0,
        matchDate: lastWeek.toISOString(),
        competition: 'Eerste Klasse',
        status: 'finished'
      },
      {
        homeTeam: 'VV Denekamp',
        awayTeam: teamName,
        homeScore: undefined,
        awayScore: undefined,
        matchDate: nextMonth.toISOString(),
        competition: 'Beker',
        status: 'scheduled'
      }
    ];
  }

  // Controleer of een wedstrijd punten telt (competitie vs beker/vriendschappelijk)
  static isCompetitiveMatch(competition: string): boolean {
    const competitiveKeywords = ['competitie', 'eredivisie', 'eerste klasse', 'tweede klasse'];
    return competitiveKeywords.some(keyword => 
      competition.toLowerCase().includes(keyword)
    );
  }

  // Update wedstrijden in de database
  static async updateMatchesInDatabase(supabase: any, matches: VoetbalMatch[]): Promise<void> {
    try {
      console.log('Bijwerken van wedstrijden in database...');
      
      for (const match of matches) {
        // Check of wedstrijd al bestaat
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('home_team', match.homeTeam)
          .eq('away_team', match.awayTeam)
          .eq('match_date', match.matchDate)
          .single();

        if (!existingMatch) {
          // Voeg nieuwe wedstrijd toe
          await supabase.from('matches').insert({
            home_team: match.homeTeam,
            away_team: match.awayTeam,
            home_score: match.homeScore,
            away_score: match.awayScore,
            match_date: match.matchDate,
            competition: match.competition,
            status: match.status,
            is_competitive: this.isCompetitiveMatch(match.competition)
          });
        } else {
          // Update bestaande wedstrijd
          await supabase
            .from('matches')
            .update({
              home_score: match.homeScore,
              away_score: match.awayScore,
              status: match.status,
              is_competitive: this.isCompetitiveMatch(match.competition)
            })
            .eq('id', existingMatch.id);
        }
      }
      
      console.log(`${matches.length} wedstrijden bijgewerkt in database`);
    } catch (error) {
      console.error('Fout bij bijwerken wedstrijden in database:', error);
    }
  }
}

// Functie om automatisch wedstrijden bij te werken (elke 6 uur)
export const scheduleMatchUpdates = (supabase: any) => {
  // Update elke 6 uur
  const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 uur in milliseconden
  
  const updateMatches = async () => {
    try {
      console.log('Automatische update van wedstrijden gestart...');
      const matches = await VoetbalService.getAllKoscMatches();
      await VoetbalService.updateMatchesInDatabase(supabase, matches);
      console.log('Automatische update van wedstrijden voltooid');
    } catch (error) {
      console.error('Fout bij automatische update van wedstrijden:', error);
    }
  };

  // Start eerste update
  updateMatches();
  
  // Plan regelmatige updates
  setInterval(updateMatches, UPDATE_INTERVAL);
  
  console.log('Automatische wedstrijd updates gepland elke 6 uur');
};
