package de.ks.hackathon.together.eigenschaften;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "false", matchIfMissing = true)
public class EigenschaftService {

    private static final Logger LOG = LoggerFactory.getLogger(EigenschaftService.class);

    private final EigenschaftRepository repository;

    public EigenschaftService(EigenschaftRepository repository) {
        this.repository = repository;
    }

    public List<Eigenschaft> findAll() {
        LOG.debug("findAll() aufgerufen");
        return repository.findAll();
    }

    public Optional<Eigenschaft> findById(Long id) {
        LOG.debug("findById({}) aufgerufen", id);
        return repository.findById(id);
    }

    public Eigenschaft save(Eigenschaft eigenschaft) {
        LOG.debug("save({}) aufgerufen", eigenschaft);
        return repository.save(eigenschaft);
    }

    public void deleteById(Long id) {
        LOG.debug("deleteById({}) aufgerufen", id);
        repository.deleteById(id);
    }

    public Optional<Eigenschaft> findByName(String name) {
        LOG.debug("findByName({}) aufgerufen", name);
        return repository.findByName(name);
    }

    public Eigenschaft createStub(String name) {
        Eigenschaft eigenschaft = new Eigenschaft();
        eigenschaft.setName(name);
        return eigenschaft;
    }
}
