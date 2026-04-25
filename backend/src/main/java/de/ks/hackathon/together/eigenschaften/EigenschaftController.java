package de.ks.hackathon.together.eigenschaften;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eigenschaften")
public class EigenschaftController {
    private final EigenschaftService service;

    public EigenschaftController(EigenschaftService service) {
        this.service = service;
    }

    @GetMapping
    public List<Eigenschaft> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Eigenschaft> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Eigenschaft create(@RequestBody Eigenschaft eigenschaft) {
        return service.save(eigenschaft);
    }

    @PutMapping("/{id}")
    public Eigenschaft update(@PathVariable Long id, @RequestBody Eigenschaft eigenschaft) {
        eigenschaft.setId(id);
        return service.save(eigenschaft);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}

