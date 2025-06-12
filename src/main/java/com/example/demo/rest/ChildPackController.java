package com.example.demo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.ChildPackDetails;
import com.example.demo.repo.ChildPackDetailsRepo;

@RestController
@RequestMapping("/api")
public class ChildPackController {

	
    @Autowired
    private  ChildPackDetailsRepo childPackDetailsRepo;
    
    
    @GetMapping("/childPackDetails")
    public List<ChildPackDetails> getChildPackDetails() {
        return childPackDetailsRepo.findAll();
    }
    
    
}
