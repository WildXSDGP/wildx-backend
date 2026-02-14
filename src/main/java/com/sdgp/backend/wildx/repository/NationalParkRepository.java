package com.sdgp.backend.wildx.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sdgp.backend.wildx.model.*;

public interface NationalParkRepository extends JpaRepository<NationalPark,Long>{
	
	
	// User Enter specific animal and this method queries and displays National Parks  that contain that animal
	@Query(value="""
			SELECT DISTINCT P.*
			FROM national-parks  P JOIN park_animal_type T 
			ON P.id= T.park_id
			WHERE T.animal_type = : animalType
			
			""",nativeQuery = true)
	List<NationalPark> findParksByAnimalType(@Param("animalType") String animalType);

}
