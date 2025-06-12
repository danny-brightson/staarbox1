package com.example.demo.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CustomerDatailsDTO;
import com.example.demo.dto.CustomerResponseDto;
import com.example.demo.dto.addressChangeDto;
import com.example.demo.dto.packageDetailsSaveRequest;
import com.example.demo.entity.CustomerDetails;
import com.example.demo.entity.RefreshToken;
import com.example.demo.repo.CustomerDetailsRepo;
import com.example.demo.repo.RefreshTokenRepo;

@Service
public class CustomerDeatilService {

	@Autowired
	private CustomerDetailsRepo customerDetailsRepo;
	
	
	@Autowired
	private RefreshTokenRepo refreshTokenRepo;
	
	public CustomerResponseDto SaveCustomerDetails(CustomerDatailsDTO CustomerDatailsDTO) throws IOException {
		
		Optional<RefreshToken> refreshToken = refreshTokenRepo.findByPhoneNumber(CustomerDatailsDTO.getPhoneNumber());
		
		if(refreshToken.isPresent()) {
			CustomerDetails customerDetails = new CustomerDetails();
			 int age = calculateAge(CustomerDatailsDTO.getdOB());
			customerDetails.setName(CustomerDatailsDTO.getName());
			customerDetails.setDateOfBirth(CustomerDatailsDTO.getdOB());
		    customerDetails.setAge(age);
			customerDetails.setAddressLine1(CustomerDatailsDTO.getAddressLine1());
			customerDetails.setAddressLine2(CustomerDatailsDTO.getAddressLine2());
			customerDetails.setGenderId(CustomerDatailsDTO.getGenderId());
			customerDetails.setPhoneNumber(CustomerDatailsDTO.getPhoneNumber());
			customerDetails.setMailId(CustomerDatailsDTO.getMailId());
			customerDetails.setPinCode(CustomerDatailsDTO.getPinCode());
			customerDetails.setDistrictId(CustomerDatailsDTO.getDistrictId());
			customerDetails.setStateId(CustomerDatailsDTO.getStateId());
			customerDetails.setAddressType(CustomerDatailsDTO.getAddressType());
			customerDetails.setDelivaryTimingId(CustomerDatailsDTO.getDelivaryTimingId());
			customerDetails.setPragnent(CustomerDatailsDTO.isPragnent());;
			customerDetails.setAlergic(CustomerDatailsDTO.isAllergic());
			customerDetails.setAlergicFruits(CustomerDatailsDTO.getFruitstoAvoid());;
			customerDetails.setStatusId((long) 1);
			customerDetails.setCreatedBy("User");
			customerDetails.setCreatedTime(LocalDateTime.now());
			customerDetails.setToken(CustomerDatailsDTO.getToken());
			
			
			
			CustomerDetails saved = customerDetailsRepo.save(customerDetails);
			
			 return new CustomerResponseDto(saved.getId(), saved.getName());
			
		}
		else {
			return null;
		}
	}
	
	 public  int calculateAge(Date birthDate) {
		 
		 LocalDate dob = birthDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	        if ((dob != null)) {
	            return Period.between(dob, LocalDate.now()).getYears();
	        } else {
	            return 0;
	        }
	    }

	public boolean savePackDetails(packageDetailsSaveRequest request) {
	boolean isCustomerIdIsPresent= customerDetailsRepo.existsById(request.getCustomerId());
	if(isCustomerIdIsPresent) {
		CustomerDetails customerDetails = new CustomerDetails();
		
		customerDetails.setEggPreferd(request.getIsEggPreferd());
		customerDetails.setPackDetailsId(request.getPackDetailsId());
		customerDetails.setId(request.getCustomerId());
		customerDetailsRepo.updatePackDetails(customerDetails.isEggPreferd(),customerDetails.getPackDetailsId(),customerDetails.getId());
		return true;
	}
		return false;
	}

	public boolean UpdateAddressDetails(addressChangeDto request) {
		
		int rowsAffected = customerDetailsRepo.updateCustomerDetails(
				request.getCustomerId(),
				request.getAddressLine1(),
				request.getAddressLine2(),
				request.getAddressType(),
		        request.getDistrictId(),
		        request.getStateId(),
		        request.getPinCode(),
		        request.getDelivaryTimingId()
		    );
		    return rowsAffected > 0;
	}
}
