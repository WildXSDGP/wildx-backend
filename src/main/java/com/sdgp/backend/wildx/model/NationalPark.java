package com.sdgp.backend.wildx.model;

import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="national_parks")
public class NationalPark {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    private String location;
    
    @Column(name = "size_in_hectares")
    private Double sizeInHectares;
    
    @Column(name = "opening_time")
    private LocalTime openingTime;
    
    @Column(name = "closing_time")
    private LocalTime closingTime;
    
    @ElementCollection
    @CollectionTable(name = "park_animal_types", joinColumns = @JoinColumn(name = "park_id"))
    @Column(name = "animal_type")
    private List<String> animalTypes;
    
    @ElementCollection
    @CollectionTable(name = "park_rules", joinColumns = @JoinColumn(name = "park_id"))
    @Column(name = "rule", length = 500)
    private List<String> rulesAndRegulations;
    
    @Column(name = "entry_fee")
    private Double entryFee;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "contact_number")
    private String contactNumber;
    
    private String email;
    
    @Column(name = "best_visiting_season")
    private String bestVisitingSeason;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    
    public NationalPark() {}


	public Long getId() {
		return id;
	}


	public String getName() {
		return name;
	}


	public String getDescription() {
		return description;
	}


	public String getLocation() {
		return location;
	}


	public Double getSizeInHectares() {
		return sizeInHectares;
	}


	public LocalTime getOpeningTime() {
		return openingTime;
	}


	public LocalTime getClosingTime() {
		return closingTime;
	}


	public List<String> getAnimalTypes() {
		return animalTypes;
	}


	public List<String> getRulesAndRegulations() {
		return rulesAndRegulations;
	}


	public Double getEntryFee() {
		return entryFee;
	}


	public String getImageUrl() {
		return imageUrl;
	}


	public String getContactNumber() {
		return contactNumber;
	}


	public String getEmail() {
		return email;
	}


	public String getBestVisitingSeason() {
		return bestVisitingSeason;
	}


	public Boolean getIsActive() {
		return isActive;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public void setName(String name) {
		this.name = name;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public void setLocation(String location) {
		this.location = location;
	}


	public void setSizeInHectares(Double sizeInHectares) {
		this.sizeInHectares = sizeInHectares;
	}


	public void setOpeningTime(LocalTime openingTime) {
		this.openingTime = openingTime;
	}


	public void setClosingTime(LocalTime closingTime) {
		this.closingTime = closingTime;
	}


	public void setAnimalTypes(List<String> animalTypes) {
		this.animalTypes = animalTypes;
	}


	public void setRulesAndRegulations(List<String> rulesAndRegulations) {
		this.rulesAndRegulations = rulesAndRegulations;
	}


	public void setEntryFee(Double entryFee) {
		this.entryFee = entryFee;
	}


	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}


	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public void setBestVisitingSeason(String bestVisitingSeason) {
		this.bestVisitingSeason = bestVisitingSeason;
	}


	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
    
    
    

}
