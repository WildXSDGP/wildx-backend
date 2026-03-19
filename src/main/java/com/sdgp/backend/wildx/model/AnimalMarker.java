package com.sdgp.backend.wildx.model;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "markers")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "animal_type", discriminatorType = DiscriminatorType.STRING)

public abstract class AnimalMarker {
     
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "park_id", nullable = false)
    private NationalPark nationalPark;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "spotted_at")
    private LocalDateTime spottedAt;

    @Column(name = "reporter_name")
    private String reporterName;

    @Column(length = 500)
    private String notes;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    
    public AnimalMarker() {
    }// for JPA
    
    public AnimalMarker(NationalPark nationalPark, Double latitude, Double longitude, 
            LocalDateTime spottedAt, String reporterName, String notes) {
    	this.nationalPark = nationalPark;
        this.latitude = latitude;
        this.longitude = longitude;
        this.spottedAt = spottedAt;
        this.reporterName = reporterName;
        this.notes = notes;
        this.isVerified = false;
    	
    } //Argument constructor 1
    
    
    public AnimalMarker(NationalPark nationalPark, Double latitude, Double longitude, 
            String reporterName, String notes) {
    	this(nationalPark, latitude, longitude, LocalDateTime.now(), reporterName, notes);
    }// Overload  constructor 2
    
    
    
    public AnimalMarker(NationalPark nationalPark, Double latitude, Double longitude) {
        this(nationalPark, latitude, longitude, LocalDateTime.now(), null, null);
    }// Overload constructor
    
    // create abstract method to get animal type
    public abstract String getAnimalType();
    
}



