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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Node
public class Eigenschaft {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String beschreibung;

    @Relationship(type = "HAT_EIGENSCHAFT", direction = Relationship.Direction.INCOMING)
    private Set<Verein> vereine;

    @Relationship(type = "HAT_EIGENSCHAFT", direction = Relationship.Direction.INCOMING)
    private Set<Angebot> angebote;
}
