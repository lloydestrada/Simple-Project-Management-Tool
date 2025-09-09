package com.simple.pmtool.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginRequest {

    private String userId;

    private String password;

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
