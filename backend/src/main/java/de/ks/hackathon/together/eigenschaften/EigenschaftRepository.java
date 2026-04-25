package de.ks.hackathon.together.eigenschaften;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface EigenschaftRepository extends Neo4jRepository<Eigenschaft, Long> {
    Optional<Eigenschaft> findByName(String name);
}
