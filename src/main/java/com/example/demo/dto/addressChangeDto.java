package com.example.demo.dto;



public class addressChangeDto {
	
	private long customerId;
	
	private String addressLine1;
	
	private String addressLine2;
	
	private String addressType;
	
	private int districtId;
	
	private int stateId;
	
	private String pinCode;
	
	private int delivaryTimingId;

	public addressChangeDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	

	public addressChangeDto(long customerId, String addressLine1, String addressLine2, String addressType,
			int districtId, int stateId, String pinCode, int delivaryTimingId) {
		super();
		this.customerId = customerId;
		this.addressLine1 = addressLine1;
		this.addressLine2 = addressLine2;
		this.addressType = addressType;
		this.districtId = districtId;
		this.stateId = stateId;
		this.pinCode = pinCode;
		this.delivaryTimingId = delivaryTimingId;
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

	public String getAddressType() {
		return addressType;
	}

	public void setAddressType(String addressType) {
		this.addressType = addressType;
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

	public String getPinCode() {
		return pinCode;
	}

	public void setPinCode(String pinCode) {
		this.pinCode = pinCode;
	}

	public int getDelivaryTimingId() {
		return delivaryTimingId;
	}

	public void setDelivaryTimingId(int delivaryTimingId) {
		this.delivaryTimingId = delivaryTimingId;
	}



	public long getCustomerId() {
		return customerId;
	}



	public void setCustomerId(long customerId) {
		this.customerId = customerId;
	}
	
}
