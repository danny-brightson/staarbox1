package com.example.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.annotations.Where;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@SuppressWarnings("deprecation")
@Entity
@Table(name = "customerdetails")
@Where(clause = "StatusId = 1")
public class CustomerDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Id")
	private Long id;

	@Column(name = "Name")
	private String name;

	@Column(name = "DateOfBirth")
	private Date dateOfBirth;

	@Column(name = "Age")
	private int age;

	@Column(name = "GenderId")
	private String genderId;

	@Column(name = "AddressLine1")
	private String addressLine1;

	@Column(name = "AddressLine2")
	private String addressLine2;

	@Column(name = "AddressType")
	private String addressType;

	@Column(name = "DistrictId")
	private int districtId;

	@Column(name = "StateId")
	private int stateId;

	@Column(name = "PinCode")
	private String pinCode;

	@Column(name = "PhoneNumber")
	private String phoneNumber;

	@Column(name = "MailId")
	private String mailId;

	@Column(name = "DelivaryTimingId")
	private int delivaryTimingId;

	@Column(name = "IsPragnent")
	private boolean isPragnent;

	@Column(name = "IsAlergic")
	private boolean isAlergic;

	@Column(name = "AlergicFruits")
	private String alergicFruits;

	@Column(name = "IsEggPreferred")
	private boolean isEggPreferd;

	@Column(name = "PackDetailsId")
	private int packDetailsId;

	@Column(name = "IsPaymentSuccess")
	private boolean isPaymentSuccess;

	@Column(name = "PaymentStatus")
	private Long paymentstatus;

	@Column(name = "IsRenewed")
	private boolean isRenewed;

	@Column(name = "RenewedDate")
	private Date renewedDate;

	@Column(name = "NextRenewalDate")
	private Date nextrenewalDate;

	@Column(name = "IsCustomized")
	private boolean isCustomized;

	@Column(name = "LastCustomizedDate")
	private Date lastCustomizedDate;

	@Column(name = "CustomerStatusId")
	private boolean customerStatusId;

	@Column(name = "StatusId")
	private Long statusId;

	@Column(name = "CreatedBy")
	private String createdBy;

	@Column(name = "CreatedTime")
	private LocalDateTime createdTime;

	@Column(name = "ModefiedBy")
	private String modefiedBy;

	@Column(name = "ModefiedTime")
	private LocalDate modefiedTime;

	@Column(name = "OrderId")
	private String orderId;

	@Column(name = "DeliveryCode")
	private String deliveryCode;

	@Column(name = "ZoneId")
	private int zoneId;

	@Column(name = "DistanceId")
	private int distanceId;

	public CustomerDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	public CustomerDetails(Long id, String name, Date dateOfBirth, int age, String genderId, String addressLine1,
			String addressLine2, String addressType, int districtId, int stateId, String pinCode, String phoneNumber,
			String mailId, int delivaryTimingId, boolean isPragnent, boolean isAlergic, String alergicFruits,
			boolean isEggPreferd, int packDetailsId, boolean isPaymentSuccess, Long paymentstatus, boolean isRenewed,
			Date renewedDate, Date nextrenewalDate, boolean isCustomized, Date lastCustomizedDate,
			boolean customerStatusId, Long statusId, String createdBy, LocalDateTime createdTime, String modefiedBy,
			LocalDate modefiedTime, String orderId, String deliveryCode, int zoneId, int  distanceId) {
		super();
		this.id = id;
		this.name = name;
		this.dateOfBirth = dateOfBirth;
		this.age = age;
		this.genderId = genderId;
		this.addressLine1 = addressLine1;
		this.addressLine2 = addressLine2;
		this.addressType = addressType;
		this.districtId = districtId;
		this.stateId = stateId;
		this.pinCode = pinCode;
		this.phoneNumber = phoneNumber;
		this.mailId = mailId;
		this.delivaryTimingId = delivaryTimingId;
		this.isPragnent = isPragnent;
		this.isAlergic = isAlergic;
		this.alergicFruits = alergicFruits;
		this.isEggPreferd = isEggPreferd;
		this.packDetailsId = packDetailsId;
		this.isPaymentSuccess = isPaymentSuccess;
		this.paymentstatus = paymentstatus;
		this.isRenewed = isRenewed;
		this.renewedDate = renewedDate;
		this.nextrenewalDate = nextrenewalDate;
		this.isCustomized = isCustomized;
		this.lastCustomizedDate = lastCustomizedDate;
		this.customerStatusId = customerStatusId;
		this.statusId = statusId;
		this.createdBy = createdBy;
		this.createdTime = createdTime;
		this.modefiedBy = modefiedBy;
		this.modefiedTime = modefiedTime;
		this.orderId = orderId;
		this.deliveryCode = deliveryCode;
		this.zoneId = zoneId;
		this.distanceId = distanceId;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
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

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getMailId() {
		return mailId;
	}

	public void setMailId(String mailId) {
		this.mailId = mailId;
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

	public boolean isAlergic() {
		return isAlergic;
	}

	public void setAlergic(boolean isAlergic) {
		this.isAlergic = isAlergic;
	}

	public String getAlergicFruits() {
		return alergicFruits;
	}

	public void setAlergicFruits(String alergicFruits) {
		this.alergicFruits = alergicFruits;
	}

	public boolean isEggPreferd() {
		return isEggPreferd;
	}

	public void setEggPreferd(boolean isEggPreferd) {
		this.isEggPreferd = isEggPreferd;
	}

	public int getPackDetailsId() {
		return packDetailsId;
	}

	public void setPackDetailsId(int packDetailsId) {
		this.packDetailsId = packDetailsId;
	}

	public boolean isPaymentSuccess() {
		return isPaymentSuccess;
	}

	public void setPaymentSuccess(boolean isPaymentSuccess) {
		this.isPaymentSuccess = isPaymentSuccess;
	}

	public Long getPaymentstatus() {
		return paymentstatus;
	}

	public void setPaymentstatus(Long paymentstatus) {
		this.paymentstatus = paymentstatus;
	}

	public boolean isRenewed() {
		return isRenewed;
	}

	public void setRenewed(boolean isRenewed) {
		this.isRenewed = isRenewed;
	}

	public Date getRenewedDate() {
		return renewedDate;
	}

	public void setRenewedDate(Date renewedDate) {
		this.renewedDate = renewedDate;
	}

	public Date getNextrenewalDate() {
		return nextrenewalDate;
	}

	public void setNextrenewalDate(Date nextrenewalDate) {
		this.nextrenewalDate = nextrenewalDate;
	}

	public boolean isCustomized() {
		return isCustomized;
	}

	public void setCustomized(boolean isCustomized) {
		this.isCustomized = isCustomized;
	}

	public Date getLastCustomizedDate() {
		return lastCustomizedDate;
	}

	public void setLastCustomizedDate(Date lastCustomizedDate) {
		this.lastCustomizedDate = lastCustomizedDate;
	}

	public boolean isCustomerStatusId() {
		return customerStatusId;
	}

	public void setCustomerStatusId(boolean customerStatusId) {
		this.customerStatusId = customerStatusId;
	}

	public Long getStatusId() {
		return statusId;
	}

	public void setStatusId(Long statusId) {
		this.statusId = statusId;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	public String getModefiedBy() {
		return modefiedBy;
	}

	public void setModefiedBy(String modefiedBy) {
		this.modefiedBy = modefiedBy;
	}

	public LocalDate getModefiedTime() {
		return modefiedTime;
	}

	public void setModefiedTime(LocalDate modefiedTime) {
		this.modefiedTime = modefiedTime;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}


	public String getDeliveryCode() {
		return deliveryCode;
	}


	public void setDeliveryCode(String deliveryCode) {
		this.deliveryCode = deliveryCode;
	}


	public int getZoneId() {
		return zoneId;
	}


	public void setZoneId(int zoneId) {
		this.zoneId = zoneId;
	}


	public int getDistanceId() {
		return distanceId;
	}


	public void setDistanceId(int distanceId) {
		this.distanceId = distanceId;
	}

}