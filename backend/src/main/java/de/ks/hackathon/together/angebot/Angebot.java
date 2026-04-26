package de.ks.hackathon.together.angebot;

import de.ks.hackathon.together.eigenschaften.Eigenschaft;
import de.ks.hackathon.together.vereine.Verein;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Relationship;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Node
public class Angebot {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;
    private String name;
    private String beschreibung;

    @Relationship(type = "BIETET_AN", direction = Relationship.Direction.INCOMING)
    @JsonBackReference
    private Set<Verein> vereine;

    @Relationship(type = "HAT_EIGENSCHAFT", direction = Relationship.Direction.OUTGOING)
    @JsonManagedReference
    private Set<Eigenschaft> eigenschaften;

    public Set<Verein> getVereine() {
        if (vereine == null) {
            vereine = new HashSet<>();
        }
        return vereine;
    }

    public Set<Eigenschaft> getEigenschaften() {
        if (eigenschaften == null) {
            eigenschaften = new HashSet<>();
        }
        return eigenschaften;
    }
}
