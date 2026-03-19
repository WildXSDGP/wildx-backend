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
    
    
    //create getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public NationalPark getNationalPark() {
		return nationalPark;
	}

	public void setNationalPark(NationalPark nationalPark) {
		this.nationalPark = nationalPark;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public LocalDateTime getSpottedAt() {
		return spottedAt;
	}

	public void setSpottedAt(LocalDateTime spottedAt) {
		this.spottedAt = spottedAt;
	}

	public String getReporterName() {
		return reporterName;
	}

	public void setReporterName(String reporterName) {
		this.reporterName = reporterName;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Boolean getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(Boolean isVerified) {
		this.isVerified = isVerified;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    
    
}



