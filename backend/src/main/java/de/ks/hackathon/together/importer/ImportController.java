package de.ks.hackathon.together.importer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportController {

    private final ImportService importService;

    @PostMapping("/vereine")
    public ResponseEntity<String> importVereine(@RequestParam("file") MultipartFile file) throws IOException {
        importService.importVereineAsync(file);
        return ResponseEntity.accepted().body("Import gestartet. Du bekommst keine Rückmeldung, aber die Daten werden im Hintergrund importiert.");
    }

    @GetMapping("/vereine/check/{id}")
    public ResponseEntity<String> checkVerein(@PathVariable("id") Long id) {
        System.out.println("Checking Verein with id: " + id);
        return ResponseEntity.of(Optional.of(importService.checkVerein(id)));
    }

    @GetMapping("/vereine/check/all")
    public ResponseEntity<Void> checkVerein() {
        System.out.println("Checking all Vereine.");
        importService.checkAllVerein();
        return ResponseEntity.ok().build();
    }
}
