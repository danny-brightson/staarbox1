package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.AvailablePromoCode;

@Repository
public interface AvailablePromoCodeRepo extends JpaRepository<AvailablePromoCode, Long> {

}
