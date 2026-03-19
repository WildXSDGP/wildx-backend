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

	@Override
	public String getAnimalType() {
		// TODO Auto-generated method stub
		return null;
	}

}
