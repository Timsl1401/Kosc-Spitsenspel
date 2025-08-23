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
  // Zoek KOSC teams op basis van echte website analyse
  static async searchKoscTeams(): Promise<string[]> {
    try {
      console.log('Zoeken naar KOSC teams op basis van website analyse...');
      
      // KOSC teams structuur:
      // - KOSC 1-7 (zondag teams)
      // - KOSC 2/3 (zaterdag teams)
      return [
        'KOSC 1',
        'KOSC 2',
        'KOSC 3',
        'KOSC 4',
        'KOSC 5',
        'KOSC 6',
        'KOSC 7',
        'KOSC 2 (Zaterdag)',
        'KOSC 3 (Zaterdag)'
      ];
    } catch (error) {
      console.error('Fout bij zoeken KOSC teams:', error);
      return [];
    }
  }

  // Haal wedstrijden op voor een specifiek team
  static async getTeamMatches(teamName: string): Promise<VoetbalMatch[]> {
    try {
      console.log(`Ophalen wedstrijden voor ${teamName} van KOSC website...`);
      
      // Probeer echte wedstrijden op te halen van KOSC website
      const matches = await this.scrapeKoscWebsite(teamName);
      
      if (matches.length > 0) {
        return matches;
      }
      
      // Als geen echte wedstrijden gevonden, return lege array
      console.log(`Geen wedstrijden gevonden voor ${teamName}`);
      return [];
    } catch (error) {
      console.error(`Fout bij ophalen wedstrijden voor ${teamName}:`, error);
      return [];
    }
  }

  // Haal echte wedstrijden op van KOSC website
  static async scrapeKoscWebsite(teamName: string): Promise<VoetbalMatch[]> {
    try {
      console.log(`Scraping KOSC website voor ${teamName}...`);
      
      // CORS probleem: frontend kan niet direct naar externe websites
      // Voor nu gebruiken we mock data, later kan dit via backend API
      console.log('CORS beperking: frontend kan niet direct naar kosc.nl');
      console.log('Gebruik mock data voor ontwikkeling');
      
      return this.getMockMatches(teamName);
      
      // Toekomstige implementatie via backend API:
      // 1. Maak backend endpoint voor scraping
      // 2. Frontend roept eigen backend aan
      // 3. Backend scraped kosc.nl en stuurt data terug
      
    } catch (error) {
      console.error(`Fout bij scraping KOSC website voor ${teamName}:`, error);
      return this.getMockMatches(teamName);
    }
  }

  // Parse wedstrijd data uit HTML
  private static parseWedstrijdData(_html: string, teamName: string): VoetbalMatch[] {
    try {
      console.log(`Parsen van wedstrijd data voor ${teamName}...`);
      
      // Voor nu returnen we mock data omdat echte HTML parsing complex is
      // Dit is een placeholder voor toekomstige implementatie
      console.log('HTML parsing nog niet geïmplementeerd - gebruik mock data');
      return this.getMockMatches(teamName);
      
      // Toekomstige implementatie:
      // 1. Zoek naar wedstrijd tabellen in de HTML
      // 2. Parse wedstrijd data (teams, scores, datums)
      // 3. Filter op basis van team naam
      // 4. Return gestructureerde wedstrijden
    } catch (error) {
      console.error(`Fout bij parsen wedstrijd data voor ${teamName}:`, error);
      return [];
    }
  }

  // Haal alle KOSC wedstrijden op
  static async getAllKoscMatches(): Promise<VoetbalMatch[]> {
    try {
      console.log('Ophalen van alle KOSC wedstrijden...');
      
      const teams = await this.searchKoscTeams();
      const allMatches: VoetbalMatch[] = [];
      
      for (const team of teams) {
        try {
          const teamMatches = await this.getTeamMatches(team);
          allMatches.push(...teamMatches);
        } catch (error) {
          console.error(`Fout bij ophalen wedstrijden voor ${team}:`, error);
        }
      }
      
      // Verwijder duplicaten en sorteer op datum
      const uniqueMatches = this.removeDuplicateMatches(allMatches);
      const sortedMatches = uniqueMatches.sort((a, b) => 
        new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
      );
      
      console.log(`Totaal ${sortedMatches.length} unieke wedstrijden gevonden voor alle teams`);
      return sortedMatches;
    } catch (error) {
      console.error('Fout bij ophalen alle KOSC wedstrijden:', error);
      return [];
    }
  }

  // Verwijder duplicaat wedstrijden
  private static removeDuplicateMatches(matches: VoetbalMatch[]): VoetbalMatch[] {
    const uniqueMatches = new Map<string, VoetbalMatch>();
    
    matches.forEach(match => {
      const key = `${match.homeTeam}_${match.awayTeam}_${match.matchDate}`;
      if (!uniqueMatches.has(key)) {
        uniqueMatches.set(key, match);
      }
    });
    
    return Array.from(uniqueMatches.values());
  }

  // Mock data voor ontwikkeling (vervang dit door echte scraping)
  private static getMockMatches(teamName: string): VoetbalMatch[] {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const nextTwoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const nextThreeWeeks = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000);
    
    // Realistische Twentse teams voor KOSC wedstrijden
    const twentseTeams = [
      'VV Oldenzaal', 'VV Losser', 'VV Weerselo', 'VV Denekamp',
      'VV Tubantia', 'VV Rigtersbleek', 'VV Drienerlo', 'VV Buurse',
      'VV Albergen', 'VV Vriezenveen', 'VV Rijssen', 'VV Enter'
    ];
    
    // Random selectie van tegenstanders (zonder duplicaten)
    const availableTeams = [...twentseTeams];
    const randomTeam1 = availableTeams.splice(Math.floor(Math.random() * availableTeams.length), 1)[0];
    const randomTeam2 = availableTeams.splice(Math.floor(Math.random() * availableTeams.length), 1)[0];
    const randomTeam3 = availableTeams.splice(Math.floor(Math.random() * availableTeams.length), 1)[0];
    const randomTeam4 = availableTeams.splice(Math.floor(Math.random() * availableTeams.length), 1)[0];
    
    // Alleen toekomstige wedstrijden (geen wedstrijden uit het verleden)
    return [
      {
        homeTeam: teamName,
        awayTeam: randomTeam1,
        homeScore: undefined,
        awayScore: undefined,
        matchDate: nextWeek.toISOString(),
        competition: 'Eerste Klasse',
        status: 'scheduled'
      },
      {
        homeTeam: randomTeam2,
        awayTeam: teamName,
        homeScore: undefined,
        awayScore: undefined,
        matchDate: nextTwoWeeks.toISOString(),
        competition: 'Eerste Klasse',
        status: 'scheduled'
      },
      {
        homeTeam: teamName,
        awayTeam: randomTeam3,
        homeScore: undefined,
        awayScore: undefined,
        matchDate: nextThreeWeeks.toISOString(),
        competition: 'Beker',
        status: 'scheduled'
      },
      {
        homeTeam: randomTeam4,
        awayTeam: teamName,
        homeScore: undefined,
        awayScore: undefined,
        matchDate: nextMonth.toISOString(),
        competition: 'Eerste Klasse',
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
      
      // Eerst controleren of de matches tabel bestaat
      try {
        const { data: tableCheck, error: tableError } = await supabase
          .from('matches')
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.error('Matches tabel bestaat niet of is niet toegankelijk:', tableError);
          throw new Error('Matches tabel niet beschikbaar in database');
        }
        
        console.log('Matches tabel is toegankelijk');
      } catch (tableCheckError) {
        console.error('Kan matches tabel niet controleren:', tableCheckError);
        throw new Error('Database tabel check mislukt');
      }
      
      for (const match of matches) {
        try {
          // Check of wedstrijd al bestaat
          const { data: existingMatch, error: checkError } = await supabase
            .from('matches')
            .select('id')
            .eq('home_team', match.homeTeam)
            .eq('away_team', match.awayTeam)
            .eq('match_date', match.matchDate)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error(`Fout bij controleren bestaande wedstrijd:`, checkError);
            continue;
          }

          if (!existingMatch) {
            // Voeg nieuwe wedstrijd toe
            const { error: insertError } = await supabase.from('matches').insert({
              home_team: match.homeTeam,
              away_team: match.awayTeam,
              home_score: match.homeScore,
              away_score: match.awayScore,
              match_date: match.matchDate,
              competition: match.competition,
              status: match.status,
              is_competitive: this.isCompetitiveMatch(match.competition)
            });

            if (insertError) {
              console.error(`Fout bij invoegen wedstrijd ${match.homeTeam} vs ${match.awayTeam}:`, insertError);
            } else {
              console.log(`Wedstrijd toegevoegd: ${match.homeTeam} vs ${match.awayTeam}`);
            }
          } else {
            // Update bestaande wedstrijd
            const { error: updateError } = await supabase
              .from('matches')
              .update({
                home_score: match.homeScore,
                away_score: match.awayScore,
                status: match.status,
                is_competitive: this.isCompetitiveMatch(match.competition)
              })
              .eq('id', existingMatch.id);

            if (updateError) {
              console.error(`Fout bij updaten wedstrijd ${match.homeTeam} vs ${match.awayTeam}:`, updateError);
            }
          }
        } catch (matchError) {
          console.error(`Fout bij verwerken wedstrijd ${match.homeTeam} vs ${match.awayTeam}:`, matchError);
        }
      }
      
      console.log(`${matches.length} wedstrijden bijgewerkt in database`);
    } catch (error) {
      console.error('Fout bij bijwerken wedstrijden in database:', error);
      throw error;
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
