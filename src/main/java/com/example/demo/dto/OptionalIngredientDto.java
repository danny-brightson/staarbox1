package com.example.demo.dto;

public class OptionalIngredientDto {
	private String name;
    private String weight;
    private Boolean isFruit;
    private String protein;
    private String fiber;
    
	
    
    
    
	
	public OptionalIngredientDto(String name, String weight, Boolean isFruit, String protein, String fiber) {
		super();
		this.name = name;
		this.weight = weight;
		this.isFruit = isFruit;
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
	public Boolean getIsFruit() {
		return isFruit;
	}
	public void setIsFruit(Boolean isFruit) {
		this.isFruit = isFruit;
	}

  
}

