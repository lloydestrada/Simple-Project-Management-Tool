package com.simple.pmtool.Controller;

import com.simple.pmtool.DTO.ProjectRequest;
import com.simple.pmtool.Model.Member;
import com.simple.pmtool.Model.Project;
import com.simple.pmtool.Service.MemberService;
import com.simple.pmtool.Service.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test02")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private MemberService memberService;

    // Get Member object from Authentication
    private Member getCurrentUser(Authentication authentication) {
        String userId = (String) authentication.getPrincipal(); // principal is String userId
        return memberService.getMemberByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET all projects
    @PreAuthorize("hasAnyRole('USER','ADMIN','SUPER_ADMIN')")
    @GetMapping("/get_all_project")
    public ResponseEntity<?> getAllProjects(Authentication authentication) {
        Member currentUser = getCurrentUser(authentication);
        List<Map<String, Object>> projects = projectService.getAllProjects(currentUser);
        return ResponseEntity.ok(Map.of("status", "success", "data", projects));
    }

    // GET project by ID
    @PreAuthorize("hasAnyRole('USER','ADMIN','SUPER_ADMIN')")
    @GetMapping("/get_project")
    public ResponseEntity<?> getProject(@RequestParam Long id, Authentication authentication) {
        Member currentUser = getCurrentUser(authentication);
        return projectService.getProjectById(id, currentUser)
                .map(p -> ResponseEntity.ok(Map.of("status", "success", "data", p)))
                .orElse(ResponseEntity.status(403)
                        .body(Map.of("status", "error", "message", "Access denied or project not found")));
    }

    // CREATE project
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PostMapping("/create_project")
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest req, Authentication authentication) {
        Member currentUser = getCurrentUser(authentication); // authenticated user
        Project project = projectService.addProject(req, currentUser); // pass owner
        return ResponseEntity.ok(Map.of("status", "success", "data", project));
    }

    // UPDATE project
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PatchMapping("/patch_project")
    public ResponseEntity<?> updateProject(@RequestParam Long id, @RequestBody ProjectRequest req, Authentication authentication) {
        Member currentUser = getCurrentUser(authentication);
        return projectService.updateProject(id, req)
                .map(p -> ResponseEntity.ok(Map.of("status", "success", "data", p)))
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("status", "error", "message", "Project not found")));
    }

    // DELETE project
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/delete_project")
    public ResponseEntity<?> deleteProject(@RequestParam Long id, Authentication authentication) {
        Member currentUser = getCurrentUser(authentication);
        boolean deleted = projectService.deleteProject(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Project deleted successfully"));
        }
        return ResponseEntity.status(404)
                .body(Map.of("status", "error", "message", "Project not found"));
    }
}
