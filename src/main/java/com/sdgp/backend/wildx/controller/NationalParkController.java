package com.sdgp.backend.wildx.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sdgp.backend.wildx.model.NationalPark;
import com.sdgp.backend.wildx.service.*;

@RestController
@RequestMapping("/parks")
public class NationalParkController {
	
	private final NationalParkService  nationalParkService;
	
	//constructor injection
	public NationalParkController(NationalParkService nationalParkService) {
		this.nationalParkService=nationalParkService;
	}
	
	// Get parks by animal Type
	@GetMapping("/search")
	public ResponseEntity<List<NationalPark>> getParksByAnimal(
			@RequestParam(name = "animal") String animalType) {
		try {
			List<NationalPark> parks = nationalParkService.getNationalParksByAnimal(animalType);
			
			if (parks.isEmpty()) {
				return ResponseEntity.notFound().build();
			}
			
			return ResponseEntity.ok(parks);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	

}
