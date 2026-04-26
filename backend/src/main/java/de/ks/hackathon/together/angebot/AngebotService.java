package de.ks.hackathon.together.angebot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "false", matchIfMissing = true)
public class AngebotService {

    private static final Logger LOG = LoggerFactory.getLogger(AngebotService.class);

    private final AngebotRepository repository;

    public AngebotService(AngebotRepository repository) {
        this.repository = repository;
    }

    public List<Angebot> findAll() {
        return repository.findAll();
    }

    public Optional<Angebot> findById(Long id) {
        return repository.findById(id);
    }

    public Angebot save(Angebot angebot) {
        return repository.save(angebot);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Optional<Angebot> findByName(String name) {
        return repository.findByName(name);
    }

    public Angebot createStub(String name) {
        Angebot angebot = new Angebot();
        angebot.setName(name);
        return angebot;
    }
}
