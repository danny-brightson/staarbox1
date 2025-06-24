package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.DeliveryPersonDetails;

@Repository
public interface DeliveryPersonDetailsRepo extends JpaRepository<DeliveryPersonDetails, Long>  {

	
	@Query(value = "select PhoneNumber from deliverypersondetails where StatusId=1 and PhoneNumber = :phoneNumber", nativeQuery = true)
	String findyPhoneNumber(String phoneNumber);

}
