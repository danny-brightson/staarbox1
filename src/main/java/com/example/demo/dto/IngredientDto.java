package com.example.demo.dto;

public class IngredientDto {
    private String name;
    private String weight;
    private String protein;
    private String fiber;

    // Constructor
    public IngredientDto(String name, String weight, String protein, String fiber) {
        this.name = name;
        this.weight = weight;
        this.protein = protein;
        this.fiber = fiber;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWeight() {
		return weight;
	}

	public void setWeight(String weight) {
		this.weight = weight;
	}

	public String getProtein() {
		return protein;
	}

	public void setProtein(String protein) {
		this.protein = protein;
	}

	public String getFiber() {
		return fiber;
	}

	public void setFiber(String fiber) {
		this.fiber = fiber;
	}

    // Getters and setters
}

