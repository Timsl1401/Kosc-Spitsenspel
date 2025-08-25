# Gastspelers Implementatie - KOSC Spitsenspel

## 🎯 **Wat zijn Gastspelers?**

Gastspelers zijn spelers die tijdelijk meespelen met een ander team dan hun eigen team. Ze krijgen punten op basis van het team waarmee ze meespelen, niet hun eigen team.

## 📊 **Voorbeeld: Bas Bruns**

### **Scenario:**
- **Bas Bruns** speelt normaal bij **KOSC 4** (1 punt per doelpunt)
- **Bas Bruns** speelt mee met **KOSC 1** en maakt **3 doelpunten**
- **Resultaat:** Je krijgt **3 × 3 = 9 punten** (KOSC 1 punten)

### **Hoe het Werkt:**
1. **Admin voegt doelpunten toe** voor Bas Bruns
2. **Team Code veld** wordt ingevuld met "KOSC 1"
3. **Systeem gebruikt** KOSC 1 punten (3 per doelpunt)
4. **Gebruiker krijgt** 9 punten in plaats van 3

## 🔧 **Technische Implementatie**

### **Database Schema:**
```sql
-- Goals tabel met team_code voor gastspelers
CREATE TABLE goals (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  minute INTEGER NOT NULL,
  team_code TEXT NOT NULL, -- NIEUW: team waarmee gespeeld
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Admin Interface:**
- **Team Code veld** toegevoegd aan doelpunten formulier
- **Optioneel:** Laat leeg om eigen team te gebruiken
- **Uitleg:** Duidelijke instructies voor admins

### **Punten Berekening:**
```typescript
// Gebruik teamCode van het goal event (voor gastspelers)
total += count * teamPoints(g.teamCode);
```

## 📋 **Stappenplan voor Admins**

### **1. Doelpunten Toevoegen:**
1. **Selecteer speler** (bijv. Bas Bruns)
2. **Vul aantal doelpunten** in (bijv. 3)
3. **Kies datum** van de wedstrijd
4. **Selecteer wedstrijd type** (competitie/vriendschappelijk)
5. **Vul Team Code in** (bijv. "KOSC 1") - OPTIONEEL
6. **Klik "Doelpunten Toevoegen"**

### **2. Team Code Regels:**
- **Leeg laten:** Speler krijgt punten van eigen team
- **Invullen:** Speler krijgt punten van opgegeven team
- **Geldige waarden:** Alle bestaande team codes

## 🎮 **Gebruikerservaring**

### **Voor Gebruikers:**
- **Automatische punten** op basis van gastspeler status
- **Geen extra actie** nodig
- **Punten worden correct** berekend

### **Voor Admins:**
- **Flexibiliteit** bij doelpunten registratie
- **Duidelijke interface** met uitleg
- **Tracking** van gastspeler doelpunten

## ✅ **Voordelen**

1. **Realistische simulatie** van voetbal
2. **Flexibiliteit** voor verschillende wedstrijden
3. **Correcte punten** voor alle scenario's
4. **Eenvoudige admin interface**
5. **Automatische berekening** voor gebruikers

## 🚀 **Toekomstige Uitbreidingen**

- **Gastspeler statistieken** in dashboard
- **Team performance** tracking
- **Wedstrijd-specifieke** doelpunten
- **Gastspeler limieten** per seizoen

---

**Gastspelers zijn nu volledig geïmplementeerd in het KOSC Spitsenspel systeem!** 🎯⚽
