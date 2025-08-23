# 🎯 Logo en Banner Bestanden Toevoegen

## 📁 Bestanden die je moet toevoegen

Om je nieuwe logo en banner te laten werken, moet je deze bestanden toevoegen aan de `public/` map:

### 1. Logo bestand
- **Bestand:** `SpitsenspelLogo.png`
- **Locatie:** `public/SpitsenspelLogo.png`
- **Beschrijving:** Je nieuwe KOSC Spitsenspel logo

### 2. Banner bestand  
- **Bestand:** `FotoKosc Zwart Wit.jpg`
- **Locatie:** `public/FotoKosc Zwart Wit.jpg`
- **Beschrijving:** Je zwart-wit voetbalfoto als achtergrond

## 🚀 Stap voor stap instructie

### Stap 1: Bestanden kopiëren
1. **Open je bestandsbeheer** (Finder op Mac, Verkenner op Windows)
2. **Ga naar de map** waar je `SpitsenspelLogo.png` en `FotoKosc Zwart Wit.jpg` hebt opgeslagen
3. **Kopieer beide bestanden**

### Stap 2: Bestanden in project plaatsen
1. **Ga naar je project map:** `/Users/timscholtelubberink/Downloads/Kosc Spitsenspel`
2. **Open de `public` map**
3. **Plak de bestanden** in de `public` map
4. **Zorg dat de namen exact kloppen:**
   - `SpitsenspelLogo.png` (niet `spitsenspellogo.png` of `SpitsenspelLogo.PNG`)
   - `FotoKosc Zwart Wit.jpg` (niet `fotokosc zwart wit.jpg`)

### Stap 3: Code aanpassen
Nadat je de bestanden hebt toegevoegd, moet je de code aanpassen:

#### In `src/components/Layout.tsx` (regel ~40):
```typescript
<img
  src="/SpitsenspelLogo.png"  // Verander dit van /kosc-logo.png
  alt="KOSC Spitsenspel"
  className="h-8 w-8 md:h-10 md:w-10 object-contain"
/>
```

#### In `src/pages/Home.tsx` (regel ~35):
```typescript
<img
  src="/FotoKosc Zwart Wit.jpg"  // Verander dit van /kosc-field.svg
  alt="KOSC Voetbalwedstrijd"
  className="w-full h-full object-cover"
/>
```

#### In `src/pages/Home.tsx` (regel ~45):
```typescript
<img
  src="/SpitsenspelLogo.png"  // Verander dit van /kosc-logo.png
  alt="KOSC Spitsenspel Logo"
  className="h-24 md:h-32 object-contain"
/>
```

### Stap 4: Testen
1. **Herstart je development server:**
   ```bash
   npm run dev
   ```
2. **Open je browser** en ga naar `http://localhost:3000`
3. **Controleer of:**
   - Het logo zichtbaar is in de header
   - De banner zichtbaar is op de homepage
   - Het logo zichtbaar is in de hero sectie

## 🔧 Tijdelijke oplossing

Momenteel gebruik ik je oude bestanden als placeholder:
- **Header logo:** `kosc-logo.png` (werkt wel)
- **Banner:** `kosc-field.svg` (werkt wel)
- **Hero logo:** `kosc-logo.png` (werkt wel)

## ❌ Veelvoorkomende problemen

1. **Bestandsnamen kloppen niet:** Zorg dat hoofdletters en spaties exact kloppen
2. **Verkeerde map:** Bestanden moeten in de `public/` map, niet in de root
3. **Server niet herstart:** Na het toevoegen van bestanden moet je `npm run dev` opnieuw starten
4. **Cache problemen:** Druk `Ctrl+F5` (Windows) of `Cmd+Shift+R` (Mac) om cache te legen

## 🎉 Resultaat

Na het toevoegen van de bestanden krijg je:
- Een professioneel KOSC Spitsenspel logo in de header
- Een mooie zwart-wit voetbalbanner op de homepage
- Een groot logo in de hero sectie
- Alle afbeeldingen laden correct

## 📞 Hulp nodig?

Als je problemen hebt:
1. Controleer of de bestandsnamen exact kloppen
2. Zorg dat de bestanden in de `public/` map staan
3. Herstart je development server
4. Leeg je browser cache
