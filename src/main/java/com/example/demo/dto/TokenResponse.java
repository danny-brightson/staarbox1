package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenResponse {

	  private String accessToken;
	    private String refreshToken;
	    @JsonProperty("isDeliverPerson")
	    private boolean isDeliverPerson;
		public TokenResponse() {
			super();
			// TODO Auto-generated constructor stub
		}
	
		public TokenResponse(String accessToken, String refreshToken, boolean isDeliverPerson) {
			super();
			this.accessToken = accessToken;
			this.refreshToken = refreshToken;
			this.isDeliverPerson = isDeliverPerson;
		}

		public String getAccessToken() {
			return accessToken;
		}
		public void setAccessToken(String accessToken) {
			this.accessToken = accessToken;
		}
		public String getRefreshToken() {
			return refreshToken;
		}
		public void setRefreshToken(String refreshToken) {
			this.refreshToken = refreshToken;
		}

		public boolean isDeliverPerson() {
			return isDeliverPerson;
		}

		public void setDeliverPerson(boolean isDeliverPerson) {
			this.isDeliverPerson = isDeliverPerson;
		}

}
