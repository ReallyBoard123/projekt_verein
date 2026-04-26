package de.ks.hackathon.together.vereine;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vereine")
public class VereinController {
    private final VereinService service;

    public VereinController(VereinService service) {
        this.service = service;
    }

    @GetMapping
    public List<Verein> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Verein> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Verein create(@RequestBody Verein verein) {
        return service.save(verein);
    }

    @PutMapping("/{id}")
    public Verein update(@PathVariable Long id, @RequestBody Verein verein) {
        verein.setId(id);
        return service.save(verein);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}

