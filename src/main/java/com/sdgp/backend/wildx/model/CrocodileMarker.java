package com.sdgp.backend.wildx.model;

import com.sdgp.backend.wildx.model.AnimalMarker;
import com.sdgp.backend.wildx.model.NationalPark;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("CROCODILE")
public class CrocodileMarker extends AnimalMarker {
	
	public CrocodileMarker() {
        super();
    }
	
	public CrocodileMarker(NationalPark nationalPark, Double latitude, Double longitude,
            LocalDateTime spottedAt, String reporterName, String notes) {
        super(nationalPark, latitude, longitude, spottedAt, reporterName, notes);
    }

    public CrocodileMarker(NationalPark nationalPark, Double latitude, Double longitude,
            String reporterName, String notes) {
        super(nationalPark, latitude, longitude, reporterName, notes);
    }

    public CrocodileMarker(NationalPark nationalPark, Double latitude, Double longitude) {
        super(nationalPark, latitude, longitude);
    }

	@Override
	public String getAnimalType() {
		
		return "Crocodile";
	}

}
