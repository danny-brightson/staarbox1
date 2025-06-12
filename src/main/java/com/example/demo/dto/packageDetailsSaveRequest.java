package com.example.demo.dto;

public class packageDetailsSaveRequest {

	private int packDetailsId;
	
	private Boolean isEggPreferd;

	private long customerId;
	
	public packageDetailsSaveRequest() {
		super();
		// TODO Auto-generated constructor stub
	}


	public packageDetailsSaveRequest(int packDetailsId, Boolean isEggPreferd, long customerId) {
		super();
		this.packDetailsId = packDetailsId;
		this.isEggPreferd = isEggPreferd;
		this.customerId = customerId;
	}


	public int getPackDetailsId() {
		return packDetailsId;
	}

	public void setPackDetailsId(int packDetailsId) {
		this.packDetailsId = packDetailsId;
	}


	public Boolean getIsEggPreferd() {
		return isEggPreferd;
	}


	public void setIsEggPreferd(Boolean isEggPreferd) {
		this.isEggPreferd = isEggPreferd;
	}


	public long getCustomerId() {
		return customerId;
	}


	public void setCustomerId(long customerId) {
		this.customerId = customerId;
	}
	
	
	
}
