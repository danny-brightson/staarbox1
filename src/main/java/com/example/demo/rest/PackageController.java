package com.example.demo.rest;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.QrCodeProjection;
import com.example.demo.repo.PackagingRepo;
import com.example.demo.service.PackagingService;
import com.example.demo.util.QRCodeGenerator;

@RestController
@RequestMapping("/api")
public class PackageController {

	@Autowired
	private PackagingService packagingService;

	@Autowired
	private PackagingRepo packagingRepo;

	@Autowired
	private QRCodeGenerator qRCodeGenerator;
	
	@PostMapping("/batch-generate")
	public ResponseEntity<String> batchGenerateQR() {
		try {
			packagingService.generateCodesForPacking();
			return ResponseEntity.ok("QR codes generated successfully for today.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}
//	@PostMapping("/qr-generate")
//	public void printBatchQRCodes() throws Exception {
//		List<QrCodeProjection> qrDataList = packagingRepo.fetchAllQrAndCodes();
//		qRCodeGenerator.generateQrPrintPdf(qrDataList, "C:\\Users\\skira\\Downloads\\pdf");
//	}
	@GetMapping("/download-qrcodes")
	public ResponseEntity<byte[]> downloadQrCodes() throws Exception {
	    List<QrCodeProjection> data = packagingRepo.fetchAllQrAndCodes();

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    QRCodeGenerator.generateQrPrintPdf(data, out); // updated method
	    byte[] pdfBytes = out.toByteArray();

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_PDF);
	    headers.setContentDispositionFormData("attachment", "qrcodes.pdf");

	    return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
	}
}
