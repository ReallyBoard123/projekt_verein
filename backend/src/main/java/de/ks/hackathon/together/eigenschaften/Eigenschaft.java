package de.ks.hackathon.together.eigenschaften;

import de.ks.hackathon.together.angebot.Angebot;
import de.ks.hackathon.together.vereine.Verein;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.Set;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Node
public class Eigenschaft {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;
    private String name;
    private String beschreibung;

    @Relationship(type = "HAT_EIGENSCHAFT", direction = Relationship.Direction.INCOMING)
    @JsonBackReference
    private Set<Verein> vereine;

    @Relationship(type = "HAT_EIGENSCHAFT", direction = Relationship.Direction.INCOMING)
    @JsonBackReference
    private Set<Angebot> angebote;

    public Set<Verein> getVereine() {
        if (vereine == null) {
            vereine = new java.util.HashSet<>();
        }
        return vereine;
    }
}
