package com.sdgp.backend.wildx.model;

import java.time.LocalDateTime;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SRI_LANKAN_LEOPARD")
public class SriLankanLeopardMarker extends AnimalMarker {
	
	
	public SriLankanLeopardMarker() {
        super();
    }
	
	public SriLankanLeopardMarker(NationalPark nationalPark, Double latitude, Double longitude,
            LocalDateTime spottedAt, String reporterName, String notes) {
		super(nationalPark, latitude, longitude, spottedAt, reporterName, notes);
	}

	public SriLankanLeopardMarker(NationalPark nationalPark, Double latitude, Double longitude,
            String reporterName, String notes) {
		super(nationalPark, latitude, longitude, reporterName, notes);
	}

	public SriLankanLeopardMarker(NationalPark nationalPark, Double latitude, Double longitude) {
		super(nationalPark, latitude, longitude);
	}

	@Override
	public String getAnimalType() {
		
		return "Sri Lankan Leopard";
	}

}
