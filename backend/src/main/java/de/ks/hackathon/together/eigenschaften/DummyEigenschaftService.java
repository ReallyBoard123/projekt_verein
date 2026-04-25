package de.ks.hackathon.together.eigenschaften;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@ConditionalOnProperty(name = "app.dummydata", havingValue = "true")
public class DummyEigenschaftService extends EigenschaftService {
    public DummyEigenschaftService() {
        super(null);
    }

    @Override
    public List<Eigenschaft> findAll() {
        List<Eigenschaft> eigenschaften = new ArrayList<>();
        for (long i = 1; i <= 10; i++) {
            Eigenschaft e = new Eigenschaft();
            e.setId(i);
            e.setName("Dummy Eigenschaft " + i);
            e.setBeschreibung("Testeigenschaft Nummer " + i);
            eigenschaften.add(e);
        }
        return eigenschaften;
    }

    @Override
    public Optional<Eigenschaft> findById(Long id) {
        return findAll().stream().filter(e -> Objects.equals(e.getId(), id)).findFirst();
    }
}

