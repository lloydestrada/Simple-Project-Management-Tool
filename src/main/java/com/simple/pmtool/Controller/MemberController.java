package com.simple.pmtool.Controller;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Service.MemberService;
import com.simple.pmtool.DTO.MemberRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    //create member
    @PostMapping("/create_member")
    public ResponseEntity<Object> createMember(@RequestBody MemberRequest request) {
        try {
            Member member = new Member();
            member.setUserId(request.getUser_id().trim());
            member.setUsername(request.getUsername().trim());
            member.setEmail(request.getEmail().trim().toLowerCase());
            member.setPassword(passwordEncoder.encode(request.getPassword()));

            Member savedMember = memberService.createMember(member); // <-- throws RuntimeException for duplicates

            Map<String, Object> response = Map.of(
                    "data", Map.of(
                            "id", savedMember.getId(),
                            "user_id", savedMember.getUserId(),
                            "username", savedMember.getUsername(),
                            "email", savedMember.getEmail()
                    )
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); // <-- returns 400, not 500
        }
    }


    // Get all members
    @GetMapping("/get_all_member")
    public ResponseEntity<Object> getAllMembers() {
        List<Member> members = memberService.getAllMembers();

        List<Map<String, Object>> memberData = members.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("user_id", m.getUserId());
            map.put("username", m.getUsername());
            map.put("email", m.getEmail());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("data", memberData));
    }

    // Get member by id
    @GetMapping("/get_member")
    public ResponseEntity<Map<String, Map<String, Object>>> getMember(@RequestParam Long id) {
        return memberService.getMemberById(id)
                .map(m -> {
                    Map<String, Object> memberData = new HashMap<>();
                    memberData.put("id", m.getId());
                    memberData.put("user_id", m.getUserId());
                    memberData.put("username", m.getUsername());
                    memberData.put("email", m.getEmail());

                    return ResponseEntity.ok(Map.of("data", memberData));
                })
                .orElseGet(() -> ResponseEntity.ok(Map.of("data", new HashMap<>())));
    }


    //update member
    @PatchMapping("/update_member")
    public ResponseEntity<Object> updateMember(
            @RequestParam Long id,
            @RequestBody Map<String, String> requestBody) {

        try {
            Optional<Member> memberOpt = memberService.getMemberById(id);
            if (memberOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of("data", Map.of())); // empty if not found
            }

            Member member = memberOpt.get();

            String oldPassword = requestBody.get("old_password");
            String newPassword = requestBody.get("new_password");
            String email = requestBody.get("email");
            String userId = requestBody.get("user_id");
            String username = requestBody.get("username");

            // Verify old password if changing password
            if (oldPassword != null && newPassword != null) {
                if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
                    return ResponseEntity.status(401)
                            .body(Map.of("error", "Old password does not match"));
                }
                // Hash new password before saving
                member.setPassword(passwordEncoder.encode(newPassword));
            }

            // Apply updates
            if (userId != null) member.setUserId(userId.trim());
            if (username != null) member.setUsername(username.trim());
            if (email != null) member.setEmail(email.trim().toLowerCase());

            Member updatedMember = memberService.updateMember(id, member);

            Map<String, Object> response = Map.of(
                    "data", Map.of(
                            "id", updatedMember.getId(),
                            "user_id", updatedMember.getUserId(),
                            "username", updatedMember.getUsername(),
                            "email", updatedMember.getEmail()
                    )
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    //delete member
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
