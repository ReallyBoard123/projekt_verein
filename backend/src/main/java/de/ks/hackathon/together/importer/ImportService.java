package de.ks.hackathon.together.importer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.ks.hackathon.together.angebot.Angebot;
import de.ks.hackathon.together.vereine.Verein;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import de.ks.hackathon.together.vereine.VereinService;
import de.ks.hackathon.together.angebot.AngebotService;
import de.ks.hackathon.together.eigenschaften.EigenschaftService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class ImportService {

    private final VereinService vereinService;
    private final AngebotService angebotService;
    private final EigenschaftService eigenschaftService;
    private final GeoDataRestClient geoDataRestClient;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    @Async
    public void importVereineAsync(MultipartFile file) throws IOException {
        log.info("Starte Import von Vereinen aus Datei: {} (Größe: {} Bytes)", file.getOriginalFilename(), file.getSize());
        JsonNode root = objectMapper.readTree(file.getInputStream());
        if (!root.isArray()) {
            log.warn("Import abgebrochen: JSON ist kein Array!");
            return;
        }
        // Optimierung: Vorab alle existierenden Entitäten laden
        var bekannteVereine = new HashMap<String, de.ks.hackathon.together.vereine.Verein>();
        vereinService.findAll().forEach(v -> bekannteVereine.put(v.getName(), v));
        var bekannteAngebote = new HashMap<String, Angebot>();
        angebotService.findAll().forEach(a -> bekannteAngebote.put(a.getName(), a));
        var bekannteEigenschaften = new HashMap<String, de.ks.hackathon.together.eigenschaften.Eigenschaft>();
        eigenschaftService.findAll().forEach(e -> bekannteEigenschaften.put(e.getName(), e));
        // Neue Entitäten sammeln
        var neueVereine = new ArrayList<de.ks.hackathon.together.vereine.Verein>();
        var neueAngebote = new ArrayList<de.ks.hackathon.together.angebot.Angebot>();
        var neueEigenschaften = new ArrayList<de.ks.hackathon.together.eigenschaften.Eigenschaft>();
        int count = 0;
        for (JsonNode node : root) {
            count++;
            String vereinName = node.path("identity").path("name").asText("");
            log.info("[{}] Importiere Verein: {}", count, vereinName);
            String website = node.path("contact").path("website").asText("");
            String address = node.path("contact").path("address_raw").asText("");
            String telefon = node.path("contact").path("phone").asText("");
            List<String> angebote = new ArrayList<>();
            node.path("classification").path("tags").forEach(tag -> {
                angebote.add(tag.asText());
                log.debug("Gefundenes Angebot: {}", tag.asText());
            });
            List<String> eigenschaften = new ArrayList<>();
            if (node.path("identity").has("is_charitable")) {
                String val = "is_charitable:" + node.path("identity").path("is_charitable").asText();
                eigenschaften.add(val);
                log.debug("[{}] Gefundene Eigenschaft: {}", count, val);
            }
            if (node.path("identity").has("type")) {
                String val = "type:" + node.path("identity").path("type").asText();
                eigenschaften.add(val);
                log.debug("[{}] Gefundene Eigenschaft: {}", count, val);
            }
            if (node.path("classification").has("district")) {
                String val = "district:" + node.path("classification").path("district").asText();
                eigenschaften.add(val);
                log.debug("[{}] Gefundene Eigenschaft: {}", count, val);
            }
            de.ks.hackathon.together.vereine.Verein verein = bekannteVereine.get(vereinName);
            if (verein == null) {
                log.info("Neuer Verein wird angelegt: {}", vereinName);
                verein = vereinService.createStub(vereinName);
                neueVereine.add(verein);
                bekannteVereine.put(vereinName, verein);
            }
            verein.setWebsiteUrl(website);
            verein.setAdresse(address);
            verein.setTelefonnummer(telefon);
            // ... im for-Loop nach verein.setAdresse(address);
            verein.setAdresse(address);
            verein.setTelefonnummer(telefon);
            // Geo-Daten setzen, falls vorhanden
            if (address != null && !address.isEmpty()) {
                try {
                    GeoResponse[] geoResponses = geoDataRestClient.geocode(address);
                    if (geoResponses.length > 0) {
                        verein.setLatitude(geoResponses[0].getLat());
                        verein.setLongitude(geoResponses[0].getLon());
                        log.info("Geo-Daten für Verein '{}' gesetzt: lat={}, lon={}", vereinName, geoResponses[0].getLat(), geoResponses[0].getLon());
                    } else {
                        log.warn("Keine Geo-Daten für Adresse '{}' gefunden.", address);
                    }
                } catch (Exception e) {
                    log.error("Fehler beim Abrufen der Geo-Daten für Adresse '{}': {}", address, e.getMessage());
                }
            }
            for (String angebotName : angebote) {
                de.ks.hackathon.together.angebot.Angebot angebot = bekannteAngebote.get(angebotName);
                if (angebot == null) {
                    log.info("Neues Angebot wird angelegt: {}", angebotName);
                    angebot = angebotService.createStub(angebotName);
                    neueAngebote.add(angebot);
                    bekannteAngebote.put(angebotName, angebot);
                }
                vereinService.addAngebot(verein, angebot);
                log.debug("[{}] Angebot '{}' mit Verein '{}' verknüpft", count, angebotName, vereinName);
            }
            for (String eigenschaftName : eigenschaften) {
                de.ks.hackathon.together.eigenschaften.Eigenschaft eigenschaft = bekannteEigenschaften.get(eigenschaftName);
                if (eigenschaft == null) {
                    log.info("Neue Eigenschaft wird angelegt: {}", eigenschaftName);
                    eigenschaft = eigenschaftService.createStub(eigenschaftName);
                    neueEigenschaften.add(eigenschaft);
                    bekannteEigenschaften.put(eigenschaftName, eigenschaft);
                }
                vereinService.addEigenschaft(verein, eigenschaft);
                log.debug("[{}] Eigenschaft '{}' mit Verein '{}' verknüpft", count, eigenschaftName, vereinName);
            }
            if (count % 50 == 0) {
                log.info("Bisher verarbeitet: {} Vereine... (noch nicht gespeichert)", count);
            }
        }
        // Jetzt alle neuen Entitäten speichern
        log.info("Speichere {} neue Vereine, {} neue Angebote, {} neue Eigenschaften...", neueVereine.size(), neueAngebote.size(), neueEigenschaften.size());
        neueAngebote.forEach(angebotService::save);
        neueEigenschaften.forEach(eigenschaftService::save);
        neueVereine.forEach(vereinService::save);
        log.info("Import abgeschlossen. Insgesamt verarbeitet: {} Vereine.", count);
    }

    public String checkVerein(Long id) {
            return vereinService.findById(id)
                    .map(this::calulatePosition)
                    .orElse("Verein mit ID " + id + " nicht gefunden.");
    }

    public void checkAllVerein() {
            vereinService.findAll().stream()
                    .map(this::calulatePosition)
                    .forEach(log::info);
    }

    private String calulatePosition(Verein verein)
    {
        if (verein.getAdresse() == null || verein.getAdresse().isEmpty()) {
            return "Keine Adresse für Verein '" + verein.getName() + "' vorhanden.";
        }

        if (verein.getLatitude() != null && verein.getLongitude() != null) {
            return "Verein '" + verein.getName() + "' hat bereits Geo-Daten: lat=" + verein.getLatitude() + ", lon=" + verein.getLongitude();
        }

        try {
            GeoResponse[] geoResponses = geoDataRestClient.geocode(verein.getAdresse());
            if (geoResponses.length > 0) {
                GeoResponse geoResponse = geoResponses[0];
                verein.setLatitude(geoResponse.getLat());
                verein.setLongitude(geoResponse.getLon());
                vereinService.save(verein);
                return "Geo-Daten für Verein '" + verein.getName() + "' aktualisiert: lat=" + geoResponse.getLat() + ", lon=" + geoResponse.getLon();
            } else {
                return "Keine Geo-Daten für Adresse '" + verein.getAdresse() + "' gefunden.";
            }
        } catch (Exception e) {
            return "Fehler beim Abrufen der Geo-Daten für Adresse '" + verein.getAdresse() + "': " + e.getMessage();
        }
    }
}
