package com.simple.pmtool.Controller;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Service.MemberService;
import com.simple.pmtool.DTO.MemberRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/test01")
public class MemberController {

    @Autowired
    private MemberService memberService;


    // Create Member
    @PostMapping("/create_member")
    public ResponseEntity<Object> createMember(@RequestBody MemberRequest request) {
        Member member = new Member();
        member.setUserId(request.getUser_id());
        member.setEmail(request.getEmail());
        member.setPassword(request.getPassword());
        member.setUsername(request.getUser_id());

        Member savedMember = memberService.createMember(member);

        Map<String, Object> response = Map.of(
                "data", Map.of(
                        "user_id", savedMember.getUserId(),
                        "email", savedMember.getEmail(),
                        "password", savedMember.getPassword()
                )
        );

        return ResponseEntity.ok(response);
    }


    // Get All Member
    @GetMapping("/get_all_member")
    public ResponseEntity<Object> getAllMembers() {
        List<Member> members = memberService.getAllMembers();

        List<Object> memberData = Collections.singletonList(members.stream().map(m -> Map.of(
                "user_id", m.getUserId(),
                "email", m.getEmail(),
                "password", m.getPassword()
        )).toList());

        Map<String, Object> response = Map.of("data", memberData);
        return ResponseEntity.ok(response);
    }

    //Get Member using ID
    @GetMapping("/get_member")
    public ResponseEntity<Object> getMember(@RequestParam Long id) {
        Optional<Member> memberOpt = memberService.getMemberById(id);

        if (memberOpt.isPresent()) {
            Member m = memberOpt.get();

            Map<String, Object> memberData = Map.of(
                    "user_id", m.getUserId(),
                    "email", m.getEmail(),
                    "password", m.getPassword()
            );

            Map<String, Object> response = Map.of("data", memberData);
            return ResponseEntity.ok(response);
        } else {
            // Return empty data object if not found
            Map<String, Object> response = Map.of("data", Map.of());
            return ResponseEntity.ok(response);
        }
    }


    // Update Member
    @PatchMapping("/update_member")
    public ResponseEntity<Object> updateMember(
            @RequestParam Long id,
            @RequestBody Map<String, String> requestBody) {

        Optional<Member> memberOpt = memberService.getMemberById(id);

        if (memberOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("data", Map.of())); // empty data if not found
        }

        Member member = memberOpt.get();

        String oldPassword = requestBody.get("old_password");
        String newPassword = requestBody.get("new_password");
        String email = requestBody.get("email");
        String userId = requestBody.get("user_id");

        // Verify old password
        if (!member.getPassword().equals(oldPassword)) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Old password does not match"));
        }

        // Update fields
        member.setUserId(userId);
        member.setEmail(email);
        member.setPassword(newPassword);

        Member updatedMember = memberService.updateMember(id, member);

        Map<String, Object> response = Map.of(
                "data", Map.of(
                        "user_id", updatedMember.getUserId(),
                        "email", updatedMember.getEmail(),
                        "password", updatedMember.getPassword()
                )
        );

        return ResponseEntity.ok(response);
    }
}
