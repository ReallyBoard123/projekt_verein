package de.ks.hackathon.together.search;

import de.ks.hackathon.together.vereine.Verein;
import de.ks.hackathon.together.vereine.VereinRepository;
import de.ks.hackathon.together.angebot.AngebotRepository;
import de.ks.hackathon.together.eigenschaften.EigenschaftRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final VereinRepository vereinRepository;
    private final AngebotRepository angebotRepository;
    private final EigenschaftRepository eigenschaftRepository;

    public SearchController(VereinRepository vereinRepository,
                            AngebotRepository angebotRepository,
                            EigenschaftRepository eigenschaftRepository) {
        this.vereinRepository = vereinRepository;
        this.angebotRepository = angebotRepository;
        this.eigenschaftRepository = eigenschaftRepository;
    }

    @PostMapping
    public List<Verein> search(@RequestBody SearchRequest request) {
        List<Verein> alleVereine = vereinRepository.findAll();

        if (request.getAngebotIds() != null && !request.getAngebotIds().isEmpty()) {
            alleVereine = alleVereine.stream()
                .filter(v -> v.getAngebote() != null &&
                    v.getAngebote().stream().anyMatch(a -> request.getAngebotIds().contains(a.getId())))
                .collect(Collectors.toList());
        }

        if (request.getEigenschaftIds() != null && !request.getEigenschaftIds().isEmpty()) {
            alleVereine = alleVereine.stream()
                .filter(v -> v.getEigenschaften() != null &&
                    v.getEigenschaften().stream().anyMatch(e -> request.getEigenschaftIds().contains(e.getId())))
                .collect(Collectors.toList());
        }

        if (request.getLatitude() != null && request.getLongitude() != null && request.getRadiusKm() != null) {
            alleVereine = alleVereine.stream()
                .filter(v -> v.getLatitude() != null && v.getLongitude() != null &&
                    haversine(v.getLatitude(), v.getLongitude(),
                              request.getLatitude(), request.getLongitude()) <= request.getRadiusKm())
                .collect(Collectors.toList());
        }

        return alleVereine;
    }

    // Haversine-Formel zur Entfernungsmessung in km
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
