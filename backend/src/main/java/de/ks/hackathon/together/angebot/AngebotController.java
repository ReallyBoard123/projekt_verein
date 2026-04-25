package de.ks.hackathon.together.angebot;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/angebote")
public class AngebotController {
    private final AngebotService service;

    public AngebotController(AngebotService service) {
        this.service = service;
    }

    @GetMapping
    public List<Angebot> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Angebot> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Angebot create(@RequestBody Angebot angebot) {
        return service.save(angebot);
    }

    @PutMapping("/{id}")
    public Angebot update(@PathVariable Long id, @RequestBody Angebot angebot) {
        angebot.setId(id);
        return service.save(angebot);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}

