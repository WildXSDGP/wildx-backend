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
	    }
	
	

	@Override
	public String getAnimalType() {
		// TODO Auto-generated method stub
		return null;
	}

}
