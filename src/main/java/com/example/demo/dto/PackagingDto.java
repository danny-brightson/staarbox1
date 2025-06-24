package com.example.demo.dto;

public class PackagingDto {
	private long Id;
	private int ZoneId;
	private int DistanceId;
	private int districtId;
    private String DeliveryCode;
	private int packDetailsId;
	
	
	
	public PackagingDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	public PackagingDto(long id, int zoneId, int distanceId, int districtId, String deliveryCode, int packDetailsId) {
		super();
		Id = id;
		ZoneId = zoneId;
		DistanceId = distanceId;
		this.districtId = districtId;
		DeliveryCode = deliveryCode;
		this.packDetailsId = packDetailsId;
	}
	public long getId() {
		return Id;
	}
	public void setId(long id) {
		Id = id;
	}
	public int getZoneId() {
		return ZoneId;
	}
	public void setZoneId(int zoneId) {
		ZoneId = zoneId;
	}
	public int getDistanceId() {
		return DistanceId;
	}
	public void setDistanceId(int distanceId) {
		DistanceId = distanceId;
	}
	public int getDistrictId() {
		return districtId;
	}
	public void setDistrictId(int districtId) {
		this.districtId = districtId;
	}
	public String getDeliveryCode() {
		return DeliveryCode;
	}
	public void setDeliveryCode(String deliveryCode) {
		DeliveryCode = deliveryCode;
	}
	public int getPackDetailsId() {
		return packDetailsId;
	}
	public void setPackDetailsId(int packDetailsId) {
		this.packDetailsId = packDetailsId;
	}
}
