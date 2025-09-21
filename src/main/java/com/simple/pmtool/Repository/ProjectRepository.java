package com.simple.pmtool.Repository;

import com.simple.pmtool.Model.Project;
import com.simple.pmtool.Model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByAssignedMembersContains(Member member);
}
