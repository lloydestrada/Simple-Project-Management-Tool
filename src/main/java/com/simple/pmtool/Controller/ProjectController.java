package com.simple.pmtool.Controller;

import com.simple.pmtool.DTO.ProjectRequest;
import com.simple.pmtool.Model.Project;
import com.simple.pmtool.Service.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/test02")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    //Get all projects
    @GetMapping("/get_all_project")
    public ResponseEntity<?> getAllProjects() {
        List<Map<String, Object>> projects = projectService.getAllProjects();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", projects
        ));
    }

    //Get project by ID
    @GetMapping("/get_project")
    public ResponseEntity<?> getProject(@RequestParam Long id) {
        return projectService.getProjectById(id)
                .map(project -> ResponseEntity.ok(Map.of(
                        "status", "success",
                        "data", project
                )))
                .orElse(ResponseEntity.status(404).body(Map.of(
                        "status", "error",
                        "message", "Project not found"
                )));
    }

    //Create project
    @PostMapping("/create_project")
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest req) {
        Project project = projectService.addProject(req);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "data", project
        ));
    }

    //Patch project (partial update)
    @PatchMapping("/patch_project")
    public ResponseEntity<?> patchProject(@RequestParam Long id, @RequestBody ProjectRequest req) {
        return projectService.updateProject(id, req)
                .map(p -> ResponseEntity.ok(Map.of(
                        "status", "success",
                        "data", p
                )))
                .orElse(ResponseEntity.status(404).body(Map.of(
                        "status", "error",
                        "message", "Project not found"
                )));
    }

    //Delete project
    @DeleteMapping("/delete_project")
    public ResponseEntity<?> deleteProject(@RequestParam Long id) {
        if (projectService.deleteProject(id)) {
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Project deleted"
            ));
        } else {
            return ResponseEntity.status(404).body(Map.of(
                    "status", "error",
                    "message", "Project not found"
            ));
        }
    }
}
