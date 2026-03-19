package com.sdgp.backend.wildx.model;

import com.sdgp.backend.wildx.model.AnimalMarker;
import com.sdgp.backend.wildx.model.NationalPark;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;

@Entity
public class AsianElephantMarker extends AnimalMarker {
	
	
	 public AsianElephantMarker() {
	        super();
	    }//JPA
	 
	 public AsianElephantMarker(NationalPark nationalPark, Double latitude, Double longitude,
	            LocalDateTime spottedAt, String reporterName, String notes) {
	        super(nationalPark, latitude, longitude, spottedAt, reporterName, notes);
	    }

	    // Constructor without spottedAt
	    public AsianElephantMarker(NationalPark nationalPark, Double latitude, Double longitude,
	            String reporterName, String notes) {
	        super(nationalPark, latitude, longitude, reporterName, notes);
	    }

	    // Minimal constructor (just location)
	    public AsianElephantMarker(NationalPark nationalPark, Double latitude, Double longitude) {
	        super(nationalPark, latitude, longitude);
	    }
	
	

	@Override
	public String getAnimalType() {
		
		return "Asian Elephant";
	}

}
