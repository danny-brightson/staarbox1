package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.CustomerFeedback;

@Repository
public interface CustomerFeedbackRepo extends JpaRepository<CustomerFeedback, Long>  {

}
