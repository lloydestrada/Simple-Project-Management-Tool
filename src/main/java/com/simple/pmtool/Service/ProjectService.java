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

    // Helper: map Project -> frontend JSON
    private Map<String, Object> toProjectResponse(Project project) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", project.getId());
        map.put("user_id", project.getOwner() != null ? project.getOwner().getUserId() : null);
        map.put("name", project.getName());
        map.put("description", project.getDescription());
        return map;
    }


    // Get all projects
    public List<Map<String, Object>> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::toProjectResponse)
                .collect(Collectors.toList());
    }

    // Get project by ID
    public Optional<Map<String, Object>> getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::toProjectResponse);
    }

    // Create new project
    public Project addProject(ProjectRequest req) {
        Member owner = memberRepository.findByUserId(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Project project = new Project();
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setOwner(owner);

        return projectRepository.save(project);
    }

    // Patch project
    public Optional<Project> updateProject(Long id, ProjectRequest req) {
        return projectRepository.findById(id).map(project -> {
            if (req.getName() != null) {
                project.setName(req.getName());
            }
            if (req.getDescription() != null) {
                project.setDescription(req.getDescription());
            }
            return projectRepository.save(project);
        });
    }

    // Delete project
    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
