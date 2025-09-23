package com.simple.pmtool.Service;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Repository.MemberRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private EntityManager entityManager; // for native queries if needed

    // Create with duplicate checks
    public Member createMember(Member member) {
        memberRepository.findByUserId(member.getUserId())
                .ifPresent(existing -> { throw new RuntimeException("User ID already exists"); });

        memberRepository.findByUsername(member.getUsername())
                .ifPresent(existing -> { throw new RuntimeException("Username already exists"); });

        memberRepository.findByEmail(member.getEmail())
                .ifPresent(existing -> { throw new RuntimeException("Email already exists"); });

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

    // Update with duplicate checks and safe password handling
    public Member updateMember(Long id, Member newData) {
        return memberRepository.findById(id).map(member -> {

            // check user_id uniqueness
            memberRepository.findByUserId(newData.getUserId())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new RuntimeException("User ID already exists");
                        }
                    });

            // check username uniqueness
            memberRepository.findByUsername(newData.getUsername())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new RuntimeException("Username already exists");
                        }
                    });

            // check email uniqueness
            memberRepository.findByEmail(newData.getEmail())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new RuntimeException("Email already exists");
                        }
                    });

            // update fields
            member.setUserId(newData.getUserId());
            member.setUsername(newData.getUsername());
            member.setEmail(newData.getEmail());
            member.setRole(newData.getRole());

            // Only hash password once
            if (newData.getPassword() != null && !newData.getPassword().isBlank()) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                member.setPassword(passwordEncoder.encode(newData.getPassword()));
            }

            return memberRepository.save(member);
        }).orElseThrow(() -> new RuntimeException("Member not found with id " + id));
    }



    // Delete with relation cleanup
    @Transactional
    public boolean deleteMember(Long id) {
        if (memberRepository.existsById(id)) {

            entityManager.createNativeQuery("DELETE FROM project_members WHERE member_id = :id")
                    .setParameter("id", id)
                    .executeUpdate();

            entityManager.createQuery("UPDATE Project p SET p.owner = null WHERE p.owner.id = :id")
                    .setParameter("id", id)
                    .executeUpdate();

            memberRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public Optional<Member> getMemberByUserId(String userId) {
        return memberRepository.findByUserId(userId);
    }
}

