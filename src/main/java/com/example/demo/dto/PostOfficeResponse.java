package com.example.demo.dto;

public class PostOfficeResponse {

    public String Name;        
    public String Description; 
    public String BranchType;  
    public String DeliveryStatus;
    public String Circle;     
    public String District;     
    public String Division;     
    public String Region;       
    public String Block;        
    public String State;        
    public String Country;     
    public String Pincode;
	public PostOfficeResponse() {
		super();
		// TODO Auto-generated constructor stub
	}
	public PostOfficeResponse(String name, String description, String branchType, String deliveryStatus, String circle,
			String district, String division, String region, String block, String state, String country,
			String pincode) {
		super();
		Name = name;
		Description = description;
		BranchType = branchType;
		DeliveryStatus = deliveryStatus;
		Circle = circle;
		District = district;
		Division = division;
		Region = region;
		Block = block;
		State = state;
		Country = country;
		Pincode = pincode;
	}
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public String getDescription() {
		return Description;
	}
	public void setDescription(String description) {
		Description = description;
	}
	public String getBranchType() {
		return BranchType;
	}
	public void setBranchType(String branchType) {
		BranchType = branchType;
	}
	public String getDeliveryStatus() {
		return DeliveryStatus;
	}
	public void setDeliveryStatus(String deliveryStatus) {
		DeliveryStatus = deliveryStatus;
	}
	public String getCircle() {
		return Circle;
	}
	public void setCircle(String circle) {
		Circle = circle;
	}
	public String getDistrict() {
		return District;
	}
	public void setDistrict(String district) {
		District = district;
	}
	public String getDivision() {
		return Division;
	}
	public void setDivision(String division) {
		Division = division;
	}
	public String getRegion() {
		return Region;
	}
	public void setRegion(String region) {
		Region = region;
	}
	public String getBlock() {
		return Block;
	}
	public void setBlock(String block) {
		Block = block;
	}
	public String getState() {
		return State;
	}
	public void setState(String state) {
		State = state;
	}
	public String getCountry() {
		return Country;
	}
	public void setCountry(String country) {
		Country = country;
	}
	public String getPincode() {
		return Pincode;
	}
	public void setPincode(String pincode) {
		Pincode = pincode;
	} 
    
    
}
