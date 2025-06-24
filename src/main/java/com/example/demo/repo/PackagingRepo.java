package com.example.demo.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.QrCodeProjection;
import com.example.demo.entity.Packaging;

import jakarta.transaction.Transactional;

@Repository
public interface PackagingRepo extends JpaRepository<Packaging, Long> {

	@Modifying
	@Transactional
	@Query(value = "TRUNCATE TABLE packaging", nativeQuery = true)
	void truncatePackagingTable();
	
	@Query("SELECT p.qrCode as qrCode, p.numberCode as numberCode FROM Packaging p WHERE p.statusId = 1")
	List<QrCodeProjection> fetchAllQrAndCodes();

}
