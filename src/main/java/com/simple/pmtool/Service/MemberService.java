package com.simple.pmtool.Service;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    // Create with duplicate checks
    public Member createMember(Member member) {
        if (memberRepository.findByUserId(member.getUserId()) != null) {
            throw new RuntimeException("User ID already exists");
        }
        if (memberRepository.findByUsername(member.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (memberRepository.findByEmail(member.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        return memberRepository.save(member);
    }

    // Get all
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // Get one
    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    // Update with duplicate checks
    public Member updateMember(Long id, Member newData) {
        return memberRepository.findById(id).map(member -> {
            // check user_id uniqueness
            Member existingByUserId = memberRepository.findByUserId(newData.getUserId());
            if (existingByUserId != null && !existingByUserId.getId().equals(id)) {
                throw new RuntimeException("User ID already exists");
            }

            // check username uniqueness
            Member existingByUsername = memberRepository.findByUsername(newData.getUsername());
            if (existingByUsername != null && !existingByUsername.getId().equals(id)) {
                throw new RuntimeException("Username already exists");
            }

            // check email uniqueness
            Member existingByEmail = memberRepository.findByEmail(newData.getEmail());
            if (existingByEmail != null && !existingByEmail.getId().equals(id)) {
                throw new RuntimeException("Email already exists");
            }

            // update fields
            member.setUserId(newData.getUserId());
            member.setUsername(newData.getUsername());
            member.setEmail(newData.getEmail());
            member.setPassword(newData.getPassword());

            return memberRepository.save(member);
        }).orElseThrow(() -> new RuntimeException("Member not found with id " + id));
    }

    // Delete
    public boolean deleteMember(Long id) {
        if (memberRepository.existsById(id)) {
            memberRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
