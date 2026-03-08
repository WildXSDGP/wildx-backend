package com.sdgp.backend.wildx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sdgp.backend.wildx.model.NationalPark;
import com.sdgp.backend.wildx.repository.*;

@Service
public class NationalParkService {

	public final NationalParkRepository nationalParkRepository;
	
	//Constructor injection
	public NationalParkService(NationalParkRepository nationalParkRepository) {
		this.nationalParkRepository=nationalParkRepository;
	}
	
	public List<NationalPark> getNationalParksByAnimal(String animalType){
		List<NationalPark> nationalParkList=this.nationalParkRepository.findParksByAnimalType(animalType);
		return nationalParkList;
	}
}
