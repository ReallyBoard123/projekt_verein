package de.ks.hackathon.together.eigenschaften;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eigenschaften")
public class EigenschaftController {

    private static final Logger LOG =
            LoggerFactory.getLogger(EigenschaftController.class);

    private final EigenschaftService service;

    public EigenschaftController(EigenschaftService service) {
        this.service = service;
    }

    @GetMapping
    public List<Eigenschaft> getAll() {
        LOG.debug("getAll() aufgerufen");
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Eigenschaft> getById(@PathVariable Long id) {
        LOG.debug("getById({}) aufgerufen", id);
        return service.findById(id);
    }

    @PostMapping
    public Eigenschaft create(@RequestBody Eigenschaft eigenschaft) {
        LOG.debug("create({}) aufgerufen", eigenschaft);
        return service.save(eigenschaft);
    }

    @PutMapping("/{id}")
    public Eigenschaft update(@PathVariable Long id, @RequestBody Eigenschaft eigenschaft) {
        LOG.debug("update({}, ...) aufgerufen", id);
        eigenschaft.setId(id);
        return service.save(eigenschaft);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        LOG.debug("delete({}) aufgerufen", id);
        service.deleteById(id);
    }
}
