package com.simple.pmtool.Controller;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.DTO.LoginRequest;
import com.simple.pmtool.Repository.MemberRepository;
import com.simple.pmtool.Security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    //Sign-up
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Member member) {
        try {
            // Check User ID first
            if (memberRepository.findByUserId(member.getUserId()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "User ID already exists"));
            }

            // Then check Username
            if (memberRepository.findByUsername(member.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Username already exists"));
            }

            // Then check Email
            if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Email already exists"));
            }

            // Hash password and save member
            member.setPassword(passwordEncoder.encode(member.getPassword()));
            memberRepository.save(member);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Signup successful",
                    "user_id", member.getUserId(),
                    "username", member.getUsername()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Signup failed: " + e.getMessage()));
        }
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String userId = loginRequest.getUserId();
            String rawPassword = loginRequest.getPassword();

            System.out.println("Login attempt -> userId: " + userId + ", password: " + rawPassword);

            return memberRepository.findByUserId(userId)
                    .map(member -> {
                        System.out.println("Found member -> " + member.getUserId() + ", encoded password: " + member.getPassword());

                        if (!passwordEncoder.matches(rawPassword, member.getPassword())) {
                            System.out.println("Password mismatch!");
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(Map.of("success", false, "message", "Invalid credentials"));
                        }

                        // Generate JWT token
                        String token = jwtUtil.generateToken(member.getUserId());
                        System.out.println("Generated token: " + token);

                        return ResponseEntity.ok(Map.of(
                                "success", true,
                                "message", "Login successful",
                                "token", token,
                                "user_id", member.getUserId(),
                                "username", member.getUsername()
                        ));
                    })
                    .orElseGet(() -> {
                        System.out.println("User not found in DB for userId: " + userId);
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("success", false, "message", "User not found"));
                    });

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 show full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Login failed: " + e.getMessage()));
        }
    }
}
