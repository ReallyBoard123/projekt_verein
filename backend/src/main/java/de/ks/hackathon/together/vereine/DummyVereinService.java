package de.ks.hackathon.together.vereine;

import de.ks.hackathon.together.angebot.Angebot;
import de.ks.hackathon.together.eigenschaften.Eigenschaft;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "true")
public class DummyVereinService extends VereinService {
    public DummyVereinService() {
        super(null);
    }

    @Override
    public List<Verein> findAll() {
        Verein v = new Verein();
        v.setId(1L);
        v.setName("Demo Verein");
        v.setBeschreibung("Dies ist ein Dummy-Verein.");
        v.setWebsiteUrl("https://dummy-verein.de");
        v.setAdresse("Musterstraße 1, 12345 Musterstadt");
        v.setTelefonnummer("01234-567890");
        v.setAngebote(new HashSet<>(Collections.singletonList(new Angebot(1L, "Dummy Angebot", "Test", null, null))));
        v.setEigenschaften(new HashSet<>(Collections.singletonList(new Eigenschaft(1L, "Rollstuhlgerecht", "", null, null))));
        return List.of(v);
    }

    @Override
    public Optional<Verein> findById(Long id) {
        return findAll().stream().filter(v -> Objects.equals(v.getId(), id)).findFirst();
    }
}

