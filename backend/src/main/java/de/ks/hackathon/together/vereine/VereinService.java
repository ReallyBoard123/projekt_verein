package de.ks.hackathon.together.vereine;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import de.ks.hackathon.together.angebot.Angebot;
import de.ks.hackathon.together.eigenschaften.Eigenschaft;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "false", matchIfMissing = true)
public class VereinService {
    private final VereinRepository repository;

    public VereinService(VereinRepository repository) {
        this.repository = repository;
    }

    public List<Verein> findAll() {
        return repository.findAll();
    }

    public Optional<Verein> findById(Long id) {
        return repository.findById(id);
    }

    public Verein save(Verein verein) {
        return repository.save(verein);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Optional<Verein> findByName(String name) {
        return repository.findByName(name);
    }

    public Verein createStub(String name) {
        Verein verein = new Verein();
        verein.setName(name);
        return verein;
    }

    public void addAngebot(Verein verein, Angebot angebot) {
        verein.getAngebote().add(angebot);
        repository.save(verein);
    }

    public void addEigenschaft(Verein verein, Eigenschaft eigenschaft) {
        verein.getEigenschaften().add(eigenschaft);
        repository.save(verein);
    }
}
