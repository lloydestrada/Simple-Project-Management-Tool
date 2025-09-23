package com.simple.pmtool.Controller;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Service.MemberService;
import com.simple.pmtool.DTO.MemberRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/test01")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberService memberService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Create member (only ADMIN/SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PostMapping("/create_member")
    public ResponseEntity<Object> createMember(@RequestBody MemberRequest request) {
        try {
            Member member = new Member();
            member.setUserId(request.getUser_id().trim());
            member.setUsername(request.getUsername().trim());
            member.setEmail(request.getEmail().trim().toLowerCase());
            member.setPassword(passwordEncoder.encode(request.getPassword()));
            member.setRole(Member.Role.valueOf(request.getRole() != null ? request.getRole().trim() : "USER"));

            Member savedMember = memberService.createMember(member);

            Map<String, Object> response = Map.of(
                    "data", Map.of(
                            "id", savedMember.getId(),
                            "user_id", savedMember.getUserId(),
                            "username", savedMember.getUsername(),
                            "email", savedMember.getEmail(),
                            "role", savedMember.getRole().name()
                    )
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all members (only ADMIN/SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @GetMapping("/get_all_member")
    public ResponseEntity<Object> getAllMembers() {
        List<Member> members = memberService.getAllMembers();

        List<Map<String, Object>> memberData = members.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("user_id", m.getUserId());
            map.put("username", m.getUsername());
            map.put("email", m.getEmail());
            map.put("role", m.getRole().name());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("data", memberData));
    }

    // Get a single member
    // ADMIN/SUPER_ADMIN can get any member, USER can only get self
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or #id.toString() == authentication.name")
    @GetMapping("/get_member")
    public ResponseEntity<Map<String, Map<String, Object>>> getMember(@RequestParam Long id) {
        return memberService.getMemberById(id)
                .map(m -> {
                    Map<String, Object> memberData = new HashMap<>();
                    memberData.put("id", m.getId());
                    memberData.put("user_id", m.getUserId());
                    memberData.put("username", m.getUsername());
                    memberData.put("email", m.getEmail());
                    memberData.put("role", m.getRole());
                    return ResponseEntity.ok(Map.of("data", memberData));
                })
                .orElseGet(() -> ResponseEntity.ok(Map.of("data", new HashMap<>())));
    }

    // Update a member
    // ADMIN/SUPER_ADMIN can update any member
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PatchMapping("/update_member")
    public ResponseEntity<Object> updateMember(
            @RequestParam Long id,
            @RequestBody Map<String, String> requestBody) {

        Optional<Member> memberOpt = memberService.getMemberById(id);

        if (memberOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Member not found with id " + id));
        }

        Member member = memberOpt.get();

        try {
            // Update fields
            String userId = requestBody.get("user_id");
            String username = requestBody.get("username");
            String email = requestBody.get("email");
            String role = requestBody.get("role");
            String password = requestBody.get("password"); // raw password

            if (userId != null) member.setUserId(userId.trim());
            if (username != null) member.setUsername(username.trim());
            if (email != null) member.setEmail(email.trim().toLowerCase());
            if (role != null && (hasRole("ADMIN") || hasRole("SUPER_ADMIN"))) {
                member.setRole(Member.Role.valueOf(role.trim()));
            }

            // Pass raw password to service; do NOT hash here
            if (password != null && !password.isBlank()) {
                member.setPassword(password);
            }

            Member updatedMember = memberService.updateMember(id, member);

            Map<String, Object> response = Map.of(
                    "data", Map.of(
                            "id", updatedMember.getId(),
                            "user_id", updatedMember.getUserId(),
                            "username", updatedMember.getUsername(),
                            "email", updatedMember.getEmail(),
                            "role", updatedMember.getRole().name()
                    )
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }



    // Utility method to check role
    private boolean hasRole(String role) {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }


    // Delete member (only SUPER_ADMIN)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/delete_member")
    public ResponseEntity<Object> deleteMember(@RequestParam Long id) {
        boolean deleted = memberService.deleteMember(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Member deleted successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Member not found"));
        }
    }
}
