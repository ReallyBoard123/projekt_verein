package de.ks.hackathon.together.eigenschaften;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "false", matchIfMissing = true)
public class EigenschaftService {
    private final EigenschaftRepository repository;

    public EigenschaftService(EigenschaftRepository repository) {
        this.repository = repository;
    }

    public List<Eigenschaft> findAll() {
        return repository.findAll();
    }

    public Optional<Eigenschaft> findById(Long id) {
        return repository.findById(id);
    }

    public Eigenschaft save(Eigenschaft eigenschaft) {
        return repository.save(eigenschaft);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Optional<Eigenschaft> findByName(String name) {
        return repository.findByName(name);
    }

    public Eigenschaft createStub(String name) {
        Eigenschaft eigenschaft = new Eigenschaft();
        eigenschaft.setName(name);
        return eigenschaft;
    }
}
