package de.ks.hackathon.together.search;

import lombok.Data;

import java.util.List;

@Data
public class SearchRequest {
    private List<Long> angebotIds;
    private List<Long> eigenschaftIds;
    private Double latitude;
    private Double longitude;
    private Double radiusKm;
}

