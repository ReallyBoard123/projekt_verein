package de.ks.hackathon.together.importer;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GeoResponse {

    private double lat;
    private double lon;

    @JsonProperty("display_name")
    private String displayName;
}
