package de.ks.hackathon.together.importer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import de.ks.hackathon.together.vereine.VereinService;
import de.ks.hackathon.together.angebot.AngebotService;
import de.ks.hackathon.together.eigenschaften.EigenschaftService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportController {
    private final VereinService vereinService;
    private final AngebotService angebotService;
    private final EigenschaftService eigenschaftService;
    private final ObjectMapper objectMapper;

    @PostMapping("/vereine")
    public ResponseEntity<String> importVereine(@RequestParam("file") MultipartFile file) throws IOException {
        JsonNode root = objectMapper.readTree(file.getInputStream());
        if (!root.isArray()) {
            return ResponseEntity.badRequest().body("JSON muss ein Array sein");
        }
        for (JsonNode node : root) {
            // Verein-Name und Website extrahieren
            String vereinName = node.path("identity").path("name").asText("");
            String website = node.path("contact").path("website").asText("");
            String address = node.path("contact").path("address_raw").asText("");
            String telefon = node.path("contact").path("phone").asText("");
            // Geo-Daten könnten ggf. aus anderen Feldern kommen

            // Angebote (tags) extrahieren
            List<String> angebote = new ArrayList<>();
            node.path("classification").path("tags").forEach(tag -> angebote.add(tag.asText()));

            // Eigenschaften (z.B. is_charitable, type, district)
            List<String> eigenschaften = new ArrayList<>();
            if (node.path("identity").has("is_charitable")) {
                eigenschaften.add("is_charitable:" + node.path("identity").path("is_charitable").asText());
            }
            if (node.path("identity").has("type")) {
                eigenschaften.add("type:" + node.path("identity").path("type").asText());
            }
            if (node.path("classification").has("district")) {
                eigenschaften.add("district:" + node.path("classification").path("district").asText());
            }

            // Verein anlegen oder updaten
            var verein = vereinService.findByName(vereinName)
                .orElseGet(() -> vereinService.createStub(vereinName));
            verein.setWebsiteUrl(website);
            verein.setAdresse(address);
            verein.setTelefonnummer(telefon);
            // TODO: Geo-Daten setzen, falls vorhanden
            verein = vereinService.save(verein);

            // Angebote verknüpfen
            for (String angebotName : angebote) {
                var angebot = angebotService.findByName(angebotName)
                    .orElseGet(() -> angebotService.createStub(angebotName));
                angebot = angebotService.save(angebot);
                vereinService.addAngebot(verein, angebot);
            }

            // Eigenschaften verknüpfen
            for (String eigenschaftName : eigenschaften) {
                var eigenschaft = eigenschaftService.findByName(eigenschaftName)
                    .orElseGet(() -> eigenschaftService.createStub(eigenschaftName));
                eigenschaft = eigenschaftService.save(eigenschaft);
                vereinService.addEigenschaft(verein, eigenschaft);
            }
        }
        return ResponseEntity.ok("Import abgeschlossen");
    }
}
