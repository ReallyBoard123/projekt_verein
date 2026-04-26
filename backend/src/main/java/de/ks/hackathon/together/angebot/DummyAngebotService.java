package de.ks.hackathon.together.angebot;

import de.ks.hackathon.together.eigenschaften.Eigenschaft;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "true")
public class DummyAngebotService extends AngebotService {

    private static final Logger LOG = LoggerFactory.getLogger(AngebotService.class);

    public DummyAngebotService() {
        super(null);
    }

    @Override
    public List<Angebot> findAll() {
        List<Angebot> angebote = new ArrayList<>();
        for (long i = 1; i <= 10; i++) {
            Angebot a = new Angebot();
            a.setId(i);
            a.setName("Dummy Angebot " + i);
            a.setBeschreibung("Testangebot Nummer " + i);
            a.setEigenschaften(new HashSet<>(Collections.singletonList(new Eigenschaft(i, "Eigenschaft zu Angebot " + i, "", null, null))));
            angebote.add(a);
        }
        return angebote;
    }

    @Override
    public Optional<Angebot> findById(Long id) {
        return findAll().stream().filter(a -> Objects.equals(a.getId(), id)).findFirst();
    }
}

