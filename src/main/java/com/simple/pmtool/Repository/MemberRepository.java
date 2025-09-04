package com.simple.pmtool.Repository;

import com.simple.pmtool.Model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // Optional custom queries
    Member findByUsername(String username);
    Member findByEmail(String email);
    Member findByUserId(String userId);
}

