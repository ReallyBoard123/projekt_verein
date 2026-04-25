# Together

**Gesellschaftliche Teilhabe durch digitale Sichtbarkeit.**

Barrierefreie Web-App, die Menschen in Kassel (und später deutschlandweit) hilft, passende Vereine und Events zu finden – personalisiert und niedrigschwellig. Entwickelt im Rahmen des Hackathons **Challenge: ZUGANG**.

---

## Das Problem

600.000 eingetragene Vereine in Deutschland – aber für viele Menschen praktisch unsichtbar. Informationen sind verstreut, Websites veraltet, bestehende Lösungen nicht barrierefrei und nicht personalisiert. Gesellschaftliche Teilhabe scheitert nicht am fehlenden Interesse, sondern an mangelnder Zugänglichkeit.

---

## Lösung & USP

**Inline-Onboarding auf der Startseite** — Kein Wizard, kein separater Screen. 4 kurze Fragen als Chips direkt im Hero-Bereich, die Vereinsliste aktualisiert sich live darunter. Sofortige Empfehlungen ohne Seitenwechsel.

**Radikale Barrierefreiheit** — WCAG 2.1 AA von Grund auf. Farbe wird nie als einziges Signal eingesetzt – immer kombiniert mit Icon und Text.

**Einfache Vereinseinreichung** — Vereine können sich über ein schlankes Formular einreichen. Kein Account, keine Hürde. Self-Service-Portal folgt in v1.1.

> Das Tinder für bürgerschaftliches Engagement.

---

## Features (MVP)

| Feature | Priorität |
|---|---|
| Inline-Onboarding + personalisierte Empfehlungen | Must Have |
| Vereinsübersicht mit Filter (Art, Entfernung, Kinderfreundlichkeit) | Must Have |
| Detailansicht Verein & Event-Übersicht | Must Have |
| Vereinseinreichung per Formular (kein Account) | Must Have |
| Self-Service-Portal (Profil & Events pflegen) | Should Have (v1.1) |
| Barrierefreiheit (WCAG 2.1 AA) | Must Have |
| Kartenansicht | Should Have (v1.1) |
| Mehrsprachigkeit DE/EN/TR | Should Have (v1.1) |

---

## Barrierefreiheit & Farben

Primärfarbe ist ein **Teal-Grün (`#0D5C63`)** statt reinem Grün – für Rot-Grün-Blinde (Deuteranopie, ~6% der Männer) unterscheidbar. Als Sekundärfarbe wird **Amber (`#B35C00`)** eingesetzt.

Farbe kommuniziert nie allein: Match-Score = Badge + Stern-Icon + Text. Ausgewählte Chips = Farbe + Umrandung + Checkmark. Fortschritt = Punkte + `Frage 2 von 4`.

---

## Personas

**Aigerim, 34** — Neuzugezogene, kein soziales Netz, sucht Angebote für sich und ihre Tochter (7).  
**Heinz, 67** — Rentner, nicht technikaffin, braucht klare Sprache und große Schrift.  
**Markus, 52** — Vereinsvorstand ohne eigene Website, will Angebote schnell online stellen.


---

*Zugang ist kein Privileg. Together macht gesellschaftliche Teilhabe für alle möglich.*

---

## Schnellstart

### Voraussetzungen

- **Node.js** (für das Frontend)
- **Java 25** (für das Backend, getestet mit Corretto 25)
- **Neo4j** (optional, nur für produktiven Betrieb)

### Starten

```bash
git clone <repo-url>
cd projekt_verein
./start.sh
```

Das Skript:
- installiert automatisch Frontend-Dependencies (`npm install`) beim ersten Start
- startet Backend (`:8080`) und Frontend (`:3000`) parallel
- beendet beide Prozesse sauber mit `Ctrl+C`
- gibt Port 8080 automatisch frei, falls er noch belegt ist

---

## Konfiguration

### Dummy-Modus (kein Neo4j nötig)

In `backend/src/main/resources/application.properties` ist bereits gesetzt:

```
app.dummydata=true
```

Damit laufen alle Endpunkte ohne eine echte Datenbank.

### Produktiver Betrieb mit Neo4j

1. Neo4j installieren: https://neo4j.com/download/
2. Datenbank starten (Standard: `bolt://localhost:7687`)
3. `application.properties` anpassen:

```
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=together
spring.neo4j.authentication.password=together
app.dummydata=false
```

---

## API

- Backend läuft auf [http://localhost:8080](http://localhost:8080)
- OpenAPI-Spezifikation: `backend/src/main/resources/openapi.yaml`
- Vereinsdaten importieren:
  ```bash
  curl -F "file=@backend/src/main/resources/kassel_vereine_master_cleaned.json" http://localhost:8080/api/import/vereine
  ```

---

