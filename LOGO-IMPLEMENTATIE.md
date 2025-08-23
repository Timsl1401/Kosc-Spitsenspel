# 🎯 Logo en Banner Implementatie Instructies

## 📁 Bestanden toevoegen

Om je nieuwe logo en banner te implementeren, moet je de volgende bestanden toevoegen aan de `public/` map:

### 1. Logo bestand
- **Bestand:** `SpitsenspelLogo.png`
- **Locatie:** `public/SpitsenspelLogo.png`
- **Beschrijving:** Je nieuwe KOSC Spitsenspel logo

### 2. Banner bestand  
- **Bestand:** `FotoKosc Zwart Wit.jpg`
- **Locatie:** `public/FotoKosc Zwart Wit.jpg`
- **Beschrijving:** Je zwart-wit voetbalfoto als achtergrond

## 🚀 Hoe toe te voegen

1. **Kopieer de bestanden** naar de `public/` map van je project
2. **Zorg dat de namen exact kloppen** (inclusief hoofdletters en spaties)
3. **Herstart je development server** met `npm run dev`

## ✨ Wat er al is geïmplementeerd

- ✅ **Header logo:** Het nieuwe logo wordt getoond in de navigatiebalk
- ✅ **Homepage banner:** De zwart-wit foto wordt gebruikt als achtergrond
- ✅ **Responsive design:** Werkt op alle schermformaten
- ✅ **Moderne styling:** Overlay en schaduwen voor betere leesbaarheid
- ✅ **Consistente navigatie:** Alle knoppen en links zijn aangepast

## 🎨 Visuele verbeteringen

- **Hero sectie:** Grote banner met logo en tekst
- **Overlay effect:** Donkere overlay voor betere leesbaarheid van witte tekst
- **Moderne knoppen:** Groene en witte knoppen met schaduwen
- **Responsive layout:** Past zich aan aan verschillende schermformaten

## 🔧 Technische details

- **Bestandsformaten:** PNG voor logo, JPG voor banner
- **CSS classes:** Alle oude KOSC classes vervangen door Tailwind CSS
- **Performance:** Geoptimaliseerde afbeeldingen met `object-cover`
- **Accessibility:** Alt-teksten toegevoegd voor screen readers

## 📱 Testen

Na het toevoegen van de bestanden:
1. Open `http://localhost:3000` in je browser
2. Controleer of het logo zichtbaar is in de header
3. Controleer of de banner zichtbaar is op de homepage
4. Test op verschillende schermformaten (mobiel, tablet, desktop)

## 🎉 Resultaat

Je website heeft nu:
- Een professioneel KOSC Spitsenspel logo in de header
- Een mooie zwart-wit voetbalbanner op de homepage
- Moderne, responsive styling
- Consistente navigatie zonder dubbele tabs
- Automatische redirect van nieuwe gebruikers naar spelregels
