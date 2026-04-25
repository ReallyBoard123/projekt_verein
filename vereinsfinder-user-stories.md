**PHASE 2: GENERIERUNG**

---

# Projekt-Zusammenfassung

Die App bietet Nutzer:innen in einer Region eine übersichtliche, filterbare Liste aller Vereine sowie deren Events – angereichert durch eine moderne, barrierefreie UX. Vereine können ihre Profile und Events selbstständig pflegen; Nutzer:innen finden über ein gamifiziertes Onboarding passende Vorschläge. Eine Kartenansicht zeigt Vereine und Events geolokalisiert an.

---

# Personas

1. **Nutzer:innen (Vereinsinteressierte)**
   - Motivation: Schnell und unkompliziert passende Vereine und Angebote in der Nähe finden; Events entdecken; direkt Kontakt aufnehmen können; kindgerechte Angebote für Familien durchsuchen.
2. **Neuzugezogene**
   - Motivation: Anschluss in neuen Stadt finden; Freizeitgestaltung und Integration durch Vereine.
3. **Vereins-Admins**
   - Motivation: Sichtbarkeit des eigenen Vereins erhöhen, eigenständig Events und Profildaten pflegen und neue Mitglieder gewinnen.
4. **App-Administrator (intern, MVP-Setup)**
   - Motivation: Basisdatenbank pflegen, Support für Vereinsvalidierung leisten und Datenqualität sicherstellen.

---

# User Stories

## 1. Vereinsübersicht (Liste & Filter)
- **Story:**  
  Als interessierte/r Nutzer:in möchte ich eine Liste aller Vereine sehen, die ich nach Art, Entfernung und Kinderfreundlichkeit filtern und sortieren kann, damit ich schnell für mich passende Angebote finde.
- **Akzeptanzkriterien:**  
  *Given* ich bin auf der Vereinsübersicht  
  *When* ich Filter auswähle (Art/Sportart, Entfernung, Kinderfreundlichkeit)  
  *Then* werden die Einträge entsprechend eingeschränkt und sortiert angezeigt
- **Priorität:** Must Have

## 2. Detailansicht Verein
- **Story:**  
  Als Nutzer:in möchte ich detaillierte Informationen (z.B. Angebote, Kontakt, Standort) zum Verein abrufen, damit ich entscheiden kann, ob der Verein zu mir passt.
- **Akzeptanzkriterien:**  
  *Given* ich klicke auf einen Vereins-Eintrag  
  *When* die Detailseite geladen wird  
  *Then* werden alle relevanten Infos zu diesem Verein übersichtlich und barrierefrei angezeigt
- **Priorität:** Must Have

## 3. Vereine & Events auf Karte anzeigen
- **Story:**  
  Als Nutzer:in möchte ich mir Vereine und Events in einer Kartenansicht anzeigen lassen, damit ich direkt sehe, was in meiner Nähe oder im gewünschten Stadtteil liegt.
- **Akzeptanzkriterien:**  
  *Given* ich öffne die Kartenansicht  
  *When* ich die Karte verschiebe/vergrößere  
  *Then* sehe ich alle relevanten Vereine/Events als Marker, die Filter bleiben erhalten
- **Priorität:** Should Have

## 4. Event-Übersicht und Detail
- **Story:**  
  Als Nutzer:in möchte ich Events von Vereinen chronologisch und gefiltert gelistet sehen, damit ich interessante Veranstaltungen leicht entdecke.
- **Akzeptanzkriterien:**  
  *Given* ich öffne die Event-Ansicht  
  *When* ich Filter wie Kategorie oder Entfernung wähle  
  *Then* werden passende Events angezeigt, Detailansicht liefert Eventinfos/Kontakt
- **Priorität:** Must Have

## 5. Gamifiziertes Nutzer-Onboarding
- **Story:**  
  Als neuer Nutzer:in möchte ich spielerisch durch Fragen/Optionen geführt werden, um mein Profil anzulegen, damit mir passende Vereinsempfehlungen gemacht werden können.
- **Akzeptanzkriterien:**  
  *Given* ich öffne die App das erste Mal/erstelle ein Profil  
  *When* ich Fragen (Präferenzen, Alter, Interessen) beantworte  
  *Then* bekomme ich ein fertiges Nutzerprofil und relevante Empfehlungen
- **Priorität:** Must Have

## 6. Vereinsanmeldung & Selbstverwaltung
- **Story:**  
  Als Vertreter:in eines Vereins möchte ich meinen Verein über die App registrieren, mein Profil anlegen und Angebote/Events eigenständig verwalten, damit ich meine Zielgruppe erreiche.
- **Akzeptanzkriterien:**  
  *Given* ich registriere meinen Verein  
  *When* ich meine Daten eingebe und überprüfe  
  *Then* wird ein Vereinsprofil erstellt und ich kann Angebote/Events eintragen und pflegen
- **Priorität:** Must Have

## 7. Barrierefreie, moderne Nutzeroberfläche
- **Story:**  
  Als Nutzer:in möchte ich eine übersichtliche, intuitive und barrierefreie Oberfläche nutzen, damit die App für alle verständlich und erreichbar ist.
- **Akzeptanzkriterien:**  
  *Given* ich nutze gängige Barriere-Tools (Screenreader, Kontrastmodus etc.)  
  *When* ich durch die App navigiere  
  *Then* bleibt die App funktional, verständlich und optisch zugänglich
- **Priorität:** Must Have

## 8. Kontaktaufnahme Verein
- **Story:**  
  Als Nutzer:in möchte ich direkt aus der App Kontakt zu einem Verein aufnehmen (z. B. per Formular, E-Mail oder Link), damit ich unverbindlich meine Fragen stellen kann.
- **Akzeptanzkriterien:**  
  *Given* ich bin im Vereinsprofil  
  *When* ich auf "Kontakt" klicke  
  *Then* öffnet sich das passende Kommunikationsmittel
- **Priorität:** Should Have

## 9. Backend-Import & Datenpflege (Backlog)
- **Story:**  
  Als App-Admin möchte ich in Zukunft städtische Vereinsregister-Daten ins System importieren können, damit die Basisdaten nicht nur manuell gepflegt werden.
- **Akzeptanzkriterien:**  
  *Given* ich habe externe Datenquellen  
  *When* ich Daten importiere  
  *Then* werden neue Vereine angelegt bzw. bestehende aktualisiert, Dubletten werden erkannt
- **Priorität:** Backlog / Nice to Have

---

**Hinweis:**  
Die Story "Vereinsmitgliedschaft an- und abmelden" wurde als geplante Erweiterung notiert und kann später als eigenständige Story spezifiziert werden.

---

**Fertig – alle Kernelemente sind analysiert und ready für die Umsetzung und LLM-Weitergabe.**