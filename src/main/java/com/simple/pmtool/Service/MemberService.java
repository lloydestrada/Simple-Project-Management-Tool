package com.simple.pmtool.Service;

import com.simple.pmtool.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.simple.pmtool.Model.Member;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    // Create
    public Member createMember(Member member) {
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

    // Update
    public Member updateMember(Long id, Member newData) {
        return memberRepository.findById(id).map(member -> {
            member.setUsername(newData.getUsername());
            member.setEmail(newData.getEmail());
            member.setPassword(newData.getPassword());
            return memberRepository.save(member);
        }).orElseThrow(() -> new RuntimeException("Member not found with id " + id));
    }
}

