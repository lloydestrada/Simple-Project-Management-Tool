package com.simple.pmtool.Controller;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.DTO.LoginRequest;
import com.simple.pmtool.Repository.MemberRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private MemberRepository memberRepository;

    @PostMapping("/testlogin")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String userId = loginRequest.getUser_id();
            String rawPassword = loginRequest.getPassword(); // renamed to avoid confusion

            if (userId == null || rawPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "user_id and password are required"));
            }

            userId = userId.trim();
            rawPassword = rawPassword.trim();

            String finalRawPassword = rawPassword; // effectively final, so lambda can use it

            return memberRepository.findByUserId(userId)
                    .map(member -> {
                        if (!member.getPassword().equals(finalRawPassword)) {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(Map.of("success", false, "message", "Invalid credentials"));
                        }
                        return ResponseEntity.ok(Map.of("success", true, "message", "Login successful"));
                    })
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("success", false, "message", "User not found")));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Login failed"));
        }
    }
}
