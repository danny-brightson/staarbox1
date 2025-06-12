package com.example.demo.rest;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CustomerDatailsDTO;
import com.example.demo.dto.CustomerResponseDto;
import com.example.demo.dto.addressChangeDto;
import com.example.demo.dto.packageDetailsSaveRequest;
import com.example.demo.entity.CustomerDetails;
import com.example.demo.repo.CustomerDetailsRepo;
import com.example.demo.service.CustomerDeatilService;

@RestController
@RequestMapping("/api")
public class CustomerDetailsRest {

	@Autowired
	private CustomerDeatilService customerDeatilService;

	@Autowired
	private CustomerDetailsRepo customerDetailsRepo;

	@PostMapping("/save")
	public ResponseEntity<?> createCustomer(@RequestBody CustomerDatailsDTO customer) {
		CustomerResponseDto response = null;
		try {
			response = customerDeatilService.SaveCustomerDetails(customer);
			
			 if (response == null) {
		            // Return 400 Bad Request with custom message
		            return ResponseEntity
		                .status(HttpStatus.BAD_REQUEST)
		                .body("Customer creation failed: required data (like phone number) might be missing.");
		        }
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ResponseEntity.ok(response);
	}
	

	@GetMapping("/customerDetails")
	public Optional<CustomerDetails> getCustomerDetails(@RequestParam int CustomerId) {
		return customerDetailsRepo.findById((long) CustomerId);
	}
	
	@PostMapping("/savePackDetails")
	public boolean savePackDetails(@RequestBody packageDetailsSaveRequest request) {

	boolean	response = customerDeatilService.savePackDetails(request);
		
		
		return response;
		
	}
	
	@PutMapping("/UpdateAddress")
	public boolean UpdateAddressDetails(@RequestBody addressChangeDto request) {

	boolean	response = customerDeatilService.UpdateAddressDetails(request);
		
		
		return response;
		
	}
}
