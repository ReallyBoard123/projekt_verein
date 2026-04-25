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

# Vereinsfinder Backend

## Voraussetzungen
- Java 17 oder höher (getestet mit Corretto 25)
- Gradle (Wrapper ist enthalten, kein separates Setup nötig)
- **Für produktiven Betrieb:** Neo4j Community oder Desktop Edition (https://neo4j.com/download/)

## Installation und Start

1. Repository clonen
2. In das Backend-Verzeichnis wechseln:
   ```
   cd backend
   ```
3. **Neo4j installieren und starten:**
    - Neo4j Desktop oder Community Edition installieren: https://neo4j.com/download/
    - Datenbank starten (Standard: bolt://localhost:7687)
    - Benutzername und Passwort merken (Standard: neo4j / bei Erststart selbst vergeben)
4. **Konfiguration prüfen:**
    - In `src/main/resources/application.properties` ggf. anpassen:
      ```
      spring.neo4j.uri=bolt://localhost:7687
      spring.neo4j.authentication.username=neo4j
      spring.neo4j.authentication.password=DEIN_PASSWORT
      ```
5. **Backend starten:**
   ```
   ./gradlew bootRun
   ```
    - Die Anwendung läuft dann auf [http://localhost:8080](http://localhost:8080)

   Falls das nicht sofort funktioniert.
   ```
   ./gradlew clean build
   ```
## Dummy-Modus (ohne Neo4j)
- In `src/main/resources/application.properties` folgende Zeile ergänzen:
  ```
  app.dummydata=true
  ```
- Dann werden Dummy-Daten für alle Endpunkte zurückgegeben und Neo4j ist nicht erforderlich.

## API-Dokumentation
- Die OpenAPI-Spezifikation findest du unter `src/main/resources/openapi.yaml`.
- Du kannst damit z.B. mit Swagger UI oder OpenAPI Generator Frontend-Clients generieren.

## Import von Vereinsdaten
- Über den Endpunkt `/api/import/vereine` kann eine JSON-Datei (z.B. `kassel_vereine_master_cleaned.json`) importiert werden.
- Beispiel mit curl:
  ```
  curl -F "file=@src/main/resources/kassel_vereine_master_cleaned.json" http://localhost:8080/api/import/vereine
  ```

## Hinweise
- Bei Problemen prüfe die Logausgabe im Terminal und ggf. die Konfiguration in `application.properties`.
- Für produktiven Betrieb wird eine laufende Neo4j-Datenbank benötigt.
- Im Dummy-Modus können alle Endpunkte getestet werden, aber es werden keine echten Daten gespeichert.

---

