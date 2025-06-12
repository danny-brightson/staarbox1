package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.StandardPackDetails;
import com.example.demo.repo.StandardPackDetailsRepo;

@RestController
@RequestMapping("/api")
public class StandardPackDetailsController {

	
	
	 @Autowired
	    private  StandardPackDetailsRepo standardPackDetailsRepo;
	 
	 @GetMapping("/standardPackDetails")
	    public List<StandardPackDetails> getstandardPackDetails() {
	        return standardPackDetailsRepo.findAll();
            }
}