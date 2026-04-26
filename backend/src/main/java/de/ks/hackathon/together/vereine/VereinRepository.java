package de.ks.hackathon.together.vereine;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface VereinRepository extends Neo4jRepository<Verein, Long> {
    Optional<Verein> findByName(String name);
}
