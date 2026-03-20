package com.sdgp.backend.wildx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
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
}
