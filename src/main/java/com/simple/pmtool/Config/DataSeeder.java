package com.simple.pmtool.Config;

import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        // Check if SUPER_ADMIN already exists
        if (memberRepository.findByUserId("superadmin").isEmpty()) {
            Member superAdmin = new Member();
            superAdmin.setUserId("superadmin");
            superAdmin.setUsername("Super Admin");
            superAdmin.setEmail("superadmin@example.com");
            superAdmin.setPassword(passwordEncoder.encode("super123")); //test password
            superAdmin.setRole(Member.Role.SUPER_ADMIN);

            memberRepository.save(superAdmin);
            System.out.println("Default SUPER_ADMIN created: superadmin / super123");
        } else {
            System.out.println("SUPER_ADMIN already exists, skipping seeding.");
        }
    }
}
