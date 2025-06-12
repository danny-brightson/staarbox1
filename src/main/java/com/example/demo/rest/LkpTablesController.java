package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.projection.AvailableDistrictProjection;
import com.example.demo.projection.DeliveryTimingProjection;
import com.example.demo.projection.GenderProjection;
import com.example.demo.projection.PackDetailsProjection;
import com.example.demo.projection.StateProjection;
import com.example.demo.repo.CustomerDetailsRepo;
import com.example.demo.repo.LkpAvailableDistrictRepo;
import com.example.demo.repo.LkpDeliveryTimingsRepo;
import com.example.demo.repo.LkpGenderRepo;
import com.example.demo.repo.LkpPackDetailsRepo;
import com.example.demo.repo.LkpStateRepo;


@RestController
@RequestMapping("/api")
public class LkpTablesController {

	
	@Autowired
	private LkpDeliveryTimingsRepo lkpDeliveryTimingsRepo;

	@Autowired
	private LkpAvailableDistrictRepo lkpAvailableDistrictRepo;
	
	@Autowired
	private LkpPackDetailsRepo lkpPackDetailsRepo;
	
	@Autowired
	private LkpStateRepo lkpStateRepo;
	
	@Autowired
	private LkpGenderRepo lkpGenderRepo;
	
	@Autowired
	private CustomerDetailsRepo customerDetailsRepo;
	
	@GetMapping("/deliveryTiming")
	public List<DeliveryTimingProjection> getDeliveryTimings() {
		return lkpDeliveryTimingsRepo.getDeliveryTimings();
	}

	@GetMapping("/availableDistrict")
	public List<AvailableDistrictProjection> getAvailableDistrict() {
		return lkpAvailableDistrictRepo.getAvailableDistrict();
	}
	
	@GetMapping("/packageDetails")
	public ResponseEntity<?> getPackDetails(@RequestParam int customerId) {
		
	int districtId = customerDetailsRepo.getDistrictId(customerId);
	
	 if (districtId == 0 ) {
         // Return 400 Bad Request with custom message
         return ResponseEntity
             .status(HttpStatus.BAD_REQUEST)
             .body("Package is not available for the districtId");
     }
	
	 List<PackDetailsProjection>  response =  lkpPackDetailsRepo.getPackDetails(districtId);
	 
		return  ResponseEntity.ok(response);
	}	
	
	@GetMapping("/gender")
	public List<GenderProjection> getGender() {
		return lkpGenderRepo.getGender();
	}
	
	@GetMapping("/state")
	public List<StateProjection> getState() {
		return lkpStateRepo.getState();
	}
	
}
