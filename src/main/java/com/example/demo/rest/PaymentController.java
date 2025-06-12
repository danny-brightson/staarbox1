package com.example.demo.rest;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OrderRequest;
import com.example.demo.entity.PaymentDetails;
import com.example.demo.repo.CustomerDetailsRepo;
import com.example.demo.repo.PaymentDetailsrepo;
import com.example.demo.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

	private final PaymentService paymentService;

	@Autowired
	private PaymentDetailsrepo paymentDetailsrepo;
	
	@Autowired
	private CustomerDetailsRepo customerDetailsRepo;

	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	@PostMapping("/create-order")
	public Map<String, Object> createOrder(@RequestParam int amount) {
		String currency = "INR";
		String receipt = "ORDER_" + UUID.randomUUID().toString();
		try {
			Map<String, Object> response = paymentService.createOrder(amount, currency, receipt);
			return (Map<String, Object>) ResponseEntity.ok(response);
		} catch (Exception e) {
			return (Map<String, Object>) ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}

	@PostMapping("/verify")
	public ResponseEntity<String> verifyPayment(@RequestParam String orderId, @RequestParam String paymentId,
			@RequestParam String signature, @RequestParam int cusId) {
		boolean isValid = paymentService.verifySignature(orderId, paymentId, signature);
		if (isValid) {
			PaymentDetails payment = new PaymentDetails();
			payment.setOrderId(orderId);
			payment.setCusId(cusId);
			payment.setPaymentId(paymentId);
			payment.setStatus("SUCCESS");
			payment.setStatusId((long) 1);
			payment.setCreatedBy("User");
			payment.setCreatedTime(LocalDateTime.now());
			paymentDetailsrepo.save(payment);
			LocalDateTime nextRenewDate = LocalDateTime.now().plusDays(30);
			customerDetailsRepo.updatePaymentStatus(isValid, nextRenewDate, cusId, orderId);
			
		}

		else {
			PaymentDetails payment = new PaymentDetails();
			payment.setOrderId(orderId);
			payment.setCusId(cusId);
			payment.setPaymentId(paymentId);
			payment.setStatus("failed");
			payment.setStatusId((long) 1);
			payment.setCreatedBy("User");
			payment.setCreatedTime(LocalDateTime.now());
			paymentDetailsrepo.save(payment);
		}

		return isValid ? ResponseEntity.ok("Payment Verified")
				: ResponseEntity.status(400).body("Payment Verification Failed");
	}
}
