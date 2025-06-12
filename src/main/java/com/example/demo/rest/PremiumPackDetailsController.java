package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.PremiumPackDetails;
import com.example.demo.repo.PremiumPackDetailsRepo;

@RestController
@RequestMapping("/api")
public class PremiumPackDetailsController {

	 @Autowired
	    private  PremiumPackDetailsRepo premiumPackDetailsRepo;
	 
	 @GetMapping("/premiumPackDetails")
	    public List<PremiumPackDetails> getpremiumPackDetails() {
	        return premiumPackDetailsRepo.findAll();
         }
}
