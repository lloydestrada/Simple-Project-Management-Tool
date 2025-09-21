package com.simple.pmtool.Service;

import com.simple.pmtool.DTO.ProjectRequest;
import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Model.Project;
import com.simple.pmtool.Repository.MemberRepository;
import com.simple.pmtool.Repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MemberRepository memberRepository;

    // Helper: map Project -> JSON for frontend
    private Map<String, Object> toProjectResponse(Project project) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", project.getId());
        map.put("owner_id", project.getOwner() != null ? project.getOwner().getUserId() : null);
        map.put("owner_name", project.getOwner() != null ? project.getOwner().getUsername() : null);
        map.put("name", project.getName());
        map.put("description", project.getDescription());
        map.put("assignedMembers", project.getAssignedMembers() != null ?
                project.getAssignedMembers().stream().map(Member::getUsername).collect(Collectors.toList())
                : new ArrayList<>());
        return map;
    }

    // Get all projects (role-based)
    public List<Map<String, Object>> getAllProjects(Member currentUser) {
        if (currentUser.getRole() == Member.Role.ADMIN || currentUser.getRole() == Member.Role.SUPER_ADMIN) {
            return projectRepository.findAll().stream().map(this::toProjectResponse).collect(Collectors.toList());
        } else {
            return projectRepository.findAllByAssignedMembersContains(currentUser)
                    .stream().map(this::toProjectResponse).collect(Collectors.toList());
        }
    }

    // Get project by ID
    public Optional<Map<String, Object>> getProjectById(Long id, Member currentUser) {
        return projectRepository.findById(id).map(project -> {
            if (currentUser.getRole() == Member.Role.ADMIN ||
                    currentUser.getRole() == Member.Role.SUPER_ADMIN ||
                    (project.getAssignedMembers() != null && project.getAssignedMembers().contains(currentUser))) {
                return toProjectResponse(project);
            }
            return null;
        });
    }

    // Create project (ADMIN & SUPER_ADMIN) — uses authenticated user as owner
    public Project addProject(ProjectRequest req, Member owner) {
        List<Member> assignedMembers = req.getAssignedMemberIds() != null ?
                req.getAssignedMemberIds().stream()
                        .map(id -> memberRepository.findByUserId(id)
                                .orElseThrow(() -> new RuntimeException("Member not found: " + id)))
                        .collect(Collectors.toList()) : new ArrayList<>();

        Project project = new Project();
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setOwner(owner); // owner comes from authentication
        project.setAssignedMembers(assignedMembers);

        return projectRepository.save(project);
    }

    // Update project (ADMIN & SUPER_ADMIN)
    public Optional<Project> updateProject(Long id, ProjectRequest req) {
        return projectRepository.findById(id).map(project -> {
            if (req.getName() != null) project.setName(req.getName());
            if (req.getDescription() != null) project.setDescription(req.getDescription());

            if (req.getAssignedMemberIds() != null) {
                List<Member> assignedMembers = req.getAssignedMemberIds().stream()
                        .map(mid -> memberRepository.findByUserId(mid)
                                .orElseThrow(() -> new RuntimeException("Member not found: " + mid)))
                        .collect(Collectors.toList());
                project.setAssignedMembers(assignedMembers);
            }
            return projectRepository.save(project);
        });
    }

    // Delete project (SUPER_ADMIN)
    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
