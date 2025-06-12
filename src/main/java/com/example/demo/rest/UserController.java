package com.example.demo.rest;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.UserDetails;
import com.example.demo.repo.UserRepository;


@RestController
@RequestMapping("/api")
public class UserController {
	 @Autowired
	    private UserRepository userRepository;

	    @GetMapping("/users")
	    public List<UserDetails> getUsers() {
	        return userRepository.findAll();
	    }
}

