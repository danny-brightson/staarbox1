package com.example.demo.rest;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PincodeAvailableResponseDto;
import com.example.demo.service.PincodeDetailsService;

@RestController
@RequestMapping("/api")
public class PincodeDetailsRest {

	@Autowired
	private PincodeDetailsService pincodeDetailsService;

	@GetMapping("/checkPinCodeAvailability")
	public  boolean checkPinCodeAvailability(@RequestParam String pincode) {
		boolean response = false;
		try {
	  response = pincodeDetailsService.CheckPinCodeAvailability(pincode);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return response;
	
	 
	}
}
