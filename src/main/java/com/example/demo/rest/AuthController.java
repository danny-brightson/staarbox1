package com.example.demo.rest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OtpVerificationRequest;
import com.example.demo.dto.TokenResponse;
import com.example.demo.entity.RefreshToken;
import com.example.demo.repo.DeliveryPersonDetailsRepo;
import com.example.demo.service.RefreshTokenService;
import com.example.demo.util.JwtUtil;

@RestController
@RequestMapping("/api")
public class AuthController {

	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private RefreshTokenService refreshTokenService;
	@Autowired
	private DeliveryPersonDetailsRepo deliveryPersonDetailsRepo;

	@PostMapping("/verify-otp")
	public ResponseEntity<TokenResponse> verifyOtp(@RequestBody OtpVerificationRequest request) {
		boolean isDeliveryPerson = false;
		// Step 2: Create user if not exists
		String phoneNumber = deliveryPersonDetailsRepo.findyPhoneNumber(request.getPhoneNumber());

		if (phoneNumber != null) {
			 isDeliveryPerson = true;
		}

		// Step 3: Create tokens
		String accessToken = jwtUtil.generateAccessToken(request.getPhoneNumber());
		RefreshToken refreshToken = refreshTokenService.createRefreshToken(request);

		// Step 4: Return tokens
		return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken.getResfreshToken(),isDeliveryPerson));
	}

	@PostMapping("/refresh")
	public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
		String refreshTokenStr = request.get("refreshToken");

		return refreshTokenService.validateToken(refreshTokenStr).map(token -> {
			String phoneNumber = token.getPhoneNumber();
			String newAccessToken = jwtUtil.generateAccessToken(phoneNumber);
			return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
		}).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(Map.of("error", "Invalid or expired refresh token")));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
		refreshTokenService.invalidateToken(request.get("refreshToken"));
		return ResponseEntity.ok("Logged out successfully.");
	}

}
