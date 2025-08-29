# KOSC Spitsenspel

Een moderne React website voor het KOSC Spitsenspel - een fantasy football spel voor de lokale voetbalclub.

## Wat is dit?

Dit is een website waar spelers van KOSC hun eigen team kunnen samenstellen en punten kunnen verdienen op basis van doelpunten van hun gekozen spelers.

## Spelregels

- Kies maximaal 15 spelers voor €100.000
- Punten: KOSC 1 (3pt), KOSC 2 (2.5pt), KOSC 3 (2pt), KOSC 4-8 (1pt)
- Alleen punten voor competitiewedstrijden
- Transfer window tot deadline, daarna max 3 nieuwe spelers
- Geen transfers in weekenden

## Project Structuur

```
src/
├── components/          # Herbruikbare componenten
│   ├── Layout.tsx      # Hoofdlayout met navigatie
│   ├── ProtectedRoute.tsx  # Route bescherming
│   └── AuthStatus.tsx  # Login status
├── pages/              # Hoofdpagina's
│   ├── Home.tsx        # Startpagina
│   ├── Dashboard.tsx   # Speler dashboard
│   ├── AdminDashboard.tsx  # Admin beheer
│   ├── Players.tsx     # Spelers overzicht
│   ├── Matches.tsx     # Wedstrijden
│   ├── Rankings.tsx    # Rangschikking
│   ├── Rules.tsx       # Spelregels
│   ├── Login.tsx       # Inloggen
│   ├── Register.tsx    # Registreren
│   ├── Feedback.tsx    # Feedback formulier
│   └── AuthCallback.tsx # Auth callback
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authenticatie
│   ├── AdminContext.tsx # Admin rechten
│   └── SupabaseContext.tsx # Database verbinding
├── lib/                # Utilities
│   └── db.ts           # Minimal DB client (no RPC/triggers)
└── App.tsx             # Hoofdcomponent met routing
```

## Database

De database gebruikt Supabase met deze hoofdtabellen:

- `players` - Spelers en hun gegevens
- `user_teams` - Teams van gebruikers
- `game_settings` - Spelinstellingen
- `feedback` - Gebruikersfeedback

## Essentiële bestanden

- `SQL/backup_schema.sql` - Minimal database structuur
- `fix-admin-permissions.sql` - Admin rechten
- `src/App.tsx` - Routing en app structuur
- `src/components/Layout.tsx` - Hoofdlayout
- `src/pages/Dashboard.tsx` - Speler dashboard
- `src/pages/AdminDashboard.tsx` - Admin beheer

## Hoe te gebruiken

### Ontwikkeling

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build
```

### Environment Variables

Maak een `.env` bestand aan in de root van het project met de volgende variabelen:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Je kunt deze waarden vinden in je Supabase project dashboard onder Settings > API.

### Database setup

1. Maak een Supabase project
2. Voer `SQL/backup_schema.sql` uit
3. Voer `fix-admin-permissions.sql` uit
4. Stel environment variables in (zie hierboven)

### Code aanpassen

- **Nieuwe pagina**: Maak een bestand in `src/pages/` en voeg route toe in `App.tsx`
- **Nieuwe component**: Maak een bestand in `src/components/`
- **Styling**: Gebruik Tailwind CSS classes
- **Database**: Voeg queries toe in de relevante pagina's

## Features

- **Admin Dashboard**: Spelers beheren, doelpunten toevoegen, monitoring
- **Speler Dashboard**: Team samenstellen, transfers, ranglijst
- **Volledige navigatie**: Alle menu items en pagina's
- **KOSC styling**: Alle originele design en branding
- **Database schema**: Alle tabellen en functionaliteit

## Problemen oplossen

### Wit scherm

Als je een wit scherm ziet, controleer dan:

1. Of je `.env` bestand correct is ingesteld
2. Of je Supabase project actief is
3. Open de browser console (F12) voor foutmeldingen
4. Probeer de browser cache te legen (Ctrl+F5 of Cmd+Shift+R)

### Service Worker

De app gebruikt een service worker voor caching. Als je problemen hebt:

1. Open de browser console
2. Ga naar Application > Service Workers
3. Klik op "Unregister" om de service worker te verwijderen
4. Ververs de pagina

## Deployment

De website wordt automatisch gedeployed naar Netlify bij pushes naar de main branch.

## Contact

Voor vragen over het spel of de website, neem contact op met de KOSC club.
