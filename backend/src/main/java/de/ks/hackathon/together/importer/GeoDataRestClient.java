package de.ks.hackathon.together.importer;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeoDataRestClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public GeoResponse[] geocode(String address) {
        System.out.println("Geocoding address: " + address);
        String url = "https://nominatim.openstreetmap.org/search?q={address}&format=json";

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "my-app (your@email.com)");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<GeoResponse[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                GeoResponse[].class,
                address
        );

        return response.getBody();
    }
}
