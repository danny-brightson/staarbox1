package com.example.demo.service;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {
	private final RazorpayClient client;
	private final String keySecret;
	private final String keyId;

	public PaymentService(@Value("${razorpay.key_id}") String keyId, @Value("${razorpay.key_secret}") String keySecret)
			throws Exception {
		this.client = new RazorpayClient(keyId, keySecret);
		this.keySecret = keySecret;
		this.keyId = keyId;
	}

	public Map<String, Object> createOrder(int amount, String currency, String receipt) throws Exception {
		JSONObject options = new JSONObject();
		options.put("amount", amount * 100); // convert ₹ to paise
		options.put("currency", currency);
		options.put("receipt", receipt);
		options.put("key", keyId); 
		options.put("payment_capture", true);

		Order order = client.orders.create(options);
		String orderId = order.get("id").toString();
		  Map<String, Object> response = new HashMap<>();
		    response.put("orderId", orderId);
		    response.put("amount", amount);
		    response.put("currency", currency);
		    response.put("receipt", receipt);
		    response.put("key", keyId);
		    
		    return response;
	}

	public boolean verifySignature(String orderId, String paymentId, String signature) {
		try {
			String data = orderId + "|" + paymentId;
			return Utils.verifySignature(data, signature, keySecret);
		} catch (Exception e) {
			return false;
		}
	}
}
