# Together

**Gesellschaftliche Teilhabe durch digitale Sichtbarkeit.**

Barrierefreie Web-App, die Menschen in Kassel (und später deutschlandweit) hilft, passende Vereine und Events zu finden – personalisiert und niedrigschwellig. Entwickelt im Rahmen des Hackathons **Challenge: ZUGANG**.

---

## Das Problem

600.000 eingetragene Vereine in Deutschland – aber für viele Menschen praktisch unsichtbar. Informationen sind verstreut, Websites veraltet, bestehende Lösungen nicht barrierefrei und nicht personalisiert. Gesellschaftliche Teilhabe scheitert nicht am fehlenden Interesse, sondern an mangelnder Zugänglichkeit.

---

## Lösung & USP

**Inline-Onboarding auf der Startseite** — Kein Wizard, kein separater Screen. Kurze Fragen als Chips direkt im Hero-Bereich, die Vereinsliste aktualisiert sich live darunter. Sofortige Empfehlungen ohne Seitenwechsel.

**Radikale Barrierefreiheit** — WCAG 2.1 AA von Grund auf. Farbe wird nie als einziges Signal eingesetzt – immer kombiniert mit Icon und Text.

**Einfache Vereinseinreichung** — Vereine können sich über ein schlankes Formular einreichen. Kein Account, keine Hürde.

> Das Tinder für bürgerschaftliches Engagement.

---

## Features (MVP)

| Feature | Priorität |
|---|---|
| Inline-Onboarding + personalisierte Empfehlungen | Must Have |
| Vereinsübersicht mit Filter (Art, Tags) | Must Have |
| Detailansicht Verein & Event-Übersicht | Must Have |
| Kartenansicht mit Standortsuche | Must Have |
| Vereinskorrektur per Formular (kein Account) | Must Have |
| Barrierefreiheit (WCAG 2.1 AA) | Must Have |
| Self-Service-Portal (Profil & Events pflegen) | Should Have (v1.1) |
| Mehrsprachigkeit DE/EN/TR | Should Have (v1.1) |

---

## Architektur

```
projekt_verein/
├── backend/      Java 25 · Spring Boot 4 · Neo4j
│                 REST API · Graph-Datenmodell · Dummy-Modus
└── frontend/     Next.js 16 · Prisma · SQLite
                  Server Actions · Wizard-Scoring · Kartenansicht
```

### Backend (Java / Neo4j)

Spring Boot 4 REST-API mit Neo4j als Graphdatenbank. Modelliert Vereine als Knoten mit Kanten zu Angeboten (`Angebot`) und Eigenschaften (`Eigenschaft`), was komplexe Beziehungsabfragen und Empfehlungen ermöglicht.

- **Dummy-Modus** (`app.dummydata=true`): Läuft ohne Neo4j-Instanz mit Testdaten
- **Produktivmodus** (`app.dummydata=false`): Erfordert laufende Neo4j-Datenbank
- **Geo-Suche**: Haversine-Formel für Umkreissuche über `/api/search`
- **Import**: Vereinsdaten per Datei-Upload über `/api/import/vereine`
- **OpenAPI**: Vollständige Spezifikation in `backend/src/main/resources/openapi.yaml`

### Frontend (Next.js / Prisma)

Next.js 16 mit Prisma und SQLite als lokale Datenbank. Alle Datenbankzugriffe laufen über Server Actions – kein separates API-Layer nötig.

- **935 Vereine** aus Kassel, kuratiert und mit Geodaten angereichert
- **Wizard-Scoring**: 9-Komponenten-Algorithmus matched Interessen auf Vereinstags
- **Kartenansicht**: Leaflet-Integration mit Cluster-Pins
- **Statische Generierung**: Top-Vereine werden zur Build-Zeit vorgerendert

---

## Schnellstart

### Voraussetzungen

- **Node.js 18+**
- **Java 21+** *(optional — nur für den Java/Neo4j-Backend)*

### Starten

```bash
git clone <repo-url>
cd projekt_verein
./start.sh
```

Das Skript übernimmt alles:
1. `npm install` beim ersten Start
2. Prisma-Migrationen und Daten-Seed (falls noch keine Datenbank vorhanden)
3. Java-Backend starten — **nur wenn Java 21+ verfügbar** (sonst überspringen, Frontend läuft eigenständig)
4. Next.js-Frontend auf `:3000` starten

| Dienst | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (optional) | http://localhost:8080 |

---

## Backend-Konfiguration

### Dummy-Modus (Standard, kein Neo4j nötig)

In `backend/src/main/resources/application.properties`:

```properties
app.dummydata=true
```

Alle Endpunkte antworten mit Testdaten.

### Produktivbetrieb mit Neo4j

```properties
app.dummydata=false
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=together
spring.neo4j.authentication.password=together
```

Vereinsdaten importieren:

```bash
curl -F "file=@backend/src/main/resources/kassel_vereine_master_cleaned.json" \
     http://localhost:8080/api/import/vereine
```

---

## Frontend-Datenbank zurücksetzen

```bash
cd frontend
npm run db:reset   # Migrationen zurücksetzen + neu seeden
npm run db:studio  # Prisma Studio öffnen
```

---

## Barrierefreiheit & Design

Primärfarbe **Teal-Grün (`#0D5C63`)** statt reinem Grün – für Rot-Grün-Blinde (Deuteranopie, ~6% der Männer) unterscheidbar. Sekundärfarbe **Amber (`#B35C00`)**.

Farbe kommuniziert nie allein: Match-Score = Badge + Icon + Text. Ausgewählte Chips = Farbe + Umrandung + Checkmark. Fortschritt = Punkte + `Frage 2 von 4`.

---

## Personas

**Aigerim, 34** — Neuzugezogene, kein soziales Netz, sucht Angebote für sich und ihre Tochter (7).
**Heinz, 67** — Rentner, nicht technikaffin, braucht klare Sprache und große Schrift.
**Markus, 52** — Vereinsvorstand ohne eigene Website, will Angebote schnell online stellen.

---

*Zugang ist kein Privileg. Together macht gesellschaftliche Teilhabe für alle möglich.*
