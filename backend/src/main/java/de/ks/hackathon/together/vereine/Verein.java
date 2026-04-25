package de.ks.hackathon.together.vereine;

import de.ks.hackathon.together.angebot.Angebot;
import de.ks.hackathon.together.eigenschaften.Eigenschaft;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Node
public class Verein {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;
    private String name;
    private String beschreibung;

    @Relationship(type = "BIETET_AN", direction = Relationship.Direction.OUTGOING)
    private Set<Angebot> angebote;

    @Relationship(type = "HAT_EIGENSCHAFT", direction = Relationship.Direction.OUTGOING)
    private Set<Eigenschaft> eigenschaften;

    private String websiteUrl;
    private String adresse;
    private String telefonnummer;
    private Double latitude;
    private Double longitude;

    public Set<Angebot> getAngebote() {
        if (angebote == null) {
            angebote = new java.util.HashSet<>();
        }
        return angebote;
    }

    public Set<Eigenschaft> getEigenschaften() {
        if (eigenschaften == null) {
            eigenschaften = new java.util.HashSet<>();
        }
        return eigenschaften;
    }
}
