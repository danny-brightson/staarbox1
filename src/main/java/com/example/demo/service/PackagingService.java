package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PackagingDto;
import com.example.demo.entity.CustomerDetails;
import com.example.demo.entity.LkpAvailableDistrict;
import com.example.demo.entity.LkpPackDetails;
import com.example.demo.entity.Packaging;
import com.example.demo.repo.CustomerDetailsRepo;
import com.example.demo.repo.LkpAvailableDistrictRepo;
import com.example.demo.repo.LkpPackDetailsRepo;
import com.example.demo.repo.PackagingRepo;
import com.example.demo.util.QRCodeGenerator;
@Service
public class PackagingService {

	@Autowired
	private CustomerDetailsRepo customerRepo;
	@Autowired
	private LkpPackDetailsRepo lkpPackDetailsRepo;
	@Autowired
	private LkpAvailableDistrictRepo lkpAvailableDistrictRepo;
	@Autowired
	private PackagingRepo packagingRepo;

	public void generateCodesForPacking() {
		
		packagingRepo.truncatePackagingTable();
		
	    List<PackagingDto> customers = customerRepo.findAllOrderByZoneDistanceAsc();

	    for (PackagingDto customer : customers) {
	        try {
	            Optional<LkpPackDetails> packageName = lkpPackDetailsRepo.findById((long) customer.getPackDetailsId());
	            Optional<LkpAvailableDistrict> districtName = lkpAvailableDistrictRepo.findById((long) customer.getDistrictId());

	            Packaging entity = new Packaging();
	            entity.setCustomerId(customer.getId());
	            entity.setDistrictId(customer.getDistrictId());
	            entity.setStatusId((long) 1);
	            entity.setCreatedBy("User");
	            entity.setCreatedTime(LocalDateTime.now());
	            entity = packagingRepo.save(entity); // Get generated ID

	            String numberCode = entity.getId() + packageName.get().getPlanCode() + districtName.get().getDistrictCode() + "-" + customer.getDeliveryCode();
	            byte[] qrImage = QRCodeGenerator.generateQRCode(String.valueOf(entity.getId()), 250, 250);

	            entity.setQrCode(qrImage); // Should be BLOB or Base64 in DB
	            entity.setNumberCode(numberCode);

	            packagingRepo.save(entity);

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	}

}
