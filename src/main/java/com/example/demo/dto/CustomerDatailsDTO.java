package com.example.demo.dto;

import java.util.Date;


public class CustomerDatailsDTO {

	private String name;
	
	private String mailId;
	
	private Date dOB;
	
	private String genderId;
	
	private String addressLine1;
	
	private String addressLine2;
	
	private String pinCode;
	
	private int districtId;
	
	private int stateId;
	
	private String addressType;
	
	private int delivaryTimingId;
	
	private boolean isPragnent;
	
	private boolean isAllergic;
	
	private String fruitstoAvoid;
	
	private String token;
	
	private String phoneNumber;

	public CustomerDatailsDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CustomerDatailsDTO(String name, String mailId, Date dOB, String genderId, String addressLine1,
			String addressLine2, String pinCode, int districtId, int stateId, String addressType, int delivaryTimingId,
			boolean isPragnent, boolean isAllergic, String fruitstoAvoid, String token, String phoneNumber) {
		super();
		this.name = name;
		this.mailId = mailId;
		this.dOB = dOB;
		this.genderId = genderId;
		this.addressLine1 = addressLine1;
		this.addressLine2 = addressLine2;
		this.pinCode = pinCode;
		this.districtId = districtId;
		this.stateId = stateId;
		this.addressType = addressType;
		this.delivaryTimingId = delivaryTimingId;
		this.isPragnent = isPragnent;
		this.isAllergic = isAllergic;
		this.fruitstoAvoid = fruitstoAvoid;
		this.token = token;
		this.phoneNumber = phoneNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMailId() {
		return mailId;
	}

	public void setMailId(String mailId) {
		this.mailId = mailId;
	}

	public Date getdOB() {
		return dOB;
	}

	public void setdOB(Date dOB) {
		this.dOB = dOB;
	}

	public String getGenderId() {
		return genderId;
	}

	public void setGenderId(String genderId) {
		this.genderId = genderId;
	}

	public String getAddressLine1() {
		return addressLine1;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public String getPinCode() {
		return pinCode;
	}

	public void setPinCode(String pinCode) {
		this.pinCode = pinCode;
	}

	public int getDistrictId() {
		return districtId;
	}

	public void setDistrictId(int districtId) {
		this.districtId = districtId;
	}

	public int getStateId() {
		return stateId;
	}

	public void setStateId(int stateId) {
		this.stateId = stateId;
	}

	public String getAddressType() {
		return addressType;
	}

	public void setAddressType(String addressType) {
		this.addressType = addressType;
	}

	public int getDelivaryTimingId() {
		return delivaryTimingId;
	}

	public void setDelivaryTimingId(int delivaryTimingId) {
		this.delivaryTimingId = delivaryTimingId;
	}

	public boolean isPragnent() {
		return isPragnent;
	}

	public void setPragnent(boolean isPragnent) {
		this.isPragnent = isPragnent;
	}

	public boolean isAllergic() {
		return isAllergic;
	}

	public void setAllergic(boolean isAllergic) {
		this.isAllergic = isAllergic;
	}

	public String getFruitstoAvoid() {
		return fruitstoAvoid;
	}

	public void setFruitstoAvoid(String fruitstoAvoid) {
		this.fruitstoAvoid = fruitstoAvoid;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	

	

}

