package com.sdgp.backend.wildx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sdgp.backend.wildx.model.AnimalMarker;


@Repository
public interface AnimalMarkerRepository extends JpaRepository<AnimalMarker, Long>{
	List<AnimalMarker> findByNationalParkId(Long parkId); //get all Markers for perticular national park
	
	
	List<AnimalMarker> findByNationalParkIdAndIsVerifiedTrue(Long parkId); // find only verified markers
	
		
	//new commit
	
	//get specific animal typemarkers from specific national park.
	List<AnimalMarker> findByParkIdAndDiscriminator(@Param("parkId") Long parkId, 
            @Param("discriminator") String discriminator);
	
	//Using native query get  specific animal type marker from National Park
	@Query(value = "SELECT DISTINCT animal_type FROM markers WHERE park_id = :parkId ORDER BY animal_type", 
	           nativeQuery = true)
	    List<String> findDistinctAnimalTypesByParkId(@Param("parkId") Long parkId);
	
}
