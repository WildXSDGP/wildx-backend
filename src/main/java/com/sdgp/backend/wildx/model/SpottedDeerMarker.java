package com.sdgp.backend.wildx.model;

import jakarta.persistence.Entity;
import com.sdgp.backend.wildx.model.AnimalMarker;
import com.sdgp.backend.wildx.model.NationalPark;
import jakarta.persistence.DiscriminatorValue;
import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("SPOTTED_DEER")
public class SpottedDeerMarker extends AnimalMarker {
	
	public SpottedDeerMarker() {
        super();
    }
	
	public SpottedDeerMarker(NationalPark nationalPark, Double latitude, Double longitude,
            LocalDateTime spottedAt, String reporterName, String notes) {
        super(nationalPark, latitude, longitude, spottedAt, reporterName, notes);
    }

    public SpottedDeerMarker(NationalPark nationalPark, Double latitude, Double longitude,
            String reporterName, String notes) {
        super(nationalPark, latitude, longitude, reporterName, notes);
    }

    public SpottedDeerMarker(NationalPark nationalPark, Double latitude, Double longitude) {
        super(nationalPark, latitude, longitude);
    }

	@Override
	public String getAnimalType() {
		
		return "Spotted Deer";
	}

}
