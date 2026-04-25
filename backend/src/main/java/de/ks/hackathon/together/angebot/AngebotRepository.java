package de.ks.hackathon.together.angebot;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface AngebotRepository extends Neo4jRepository<Angebot, Long> {
    Optional<Angebot> findByName(String name);
}
