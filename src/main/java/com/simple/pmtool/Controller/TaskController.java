package com.simple.pmtool.Controller;

import com.simple.pmtool.DTO.TaskRequest;
import com.simple.pmtool.Model.Task;
import com.simple.pmtool.Service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/test03")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Create Task (USER, ADMIN, SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('USER','ADMIN','SUPER_ADMIN')")
    @PostMapping("/create_task")
    public ResponseEntity<?> createTask(@RequestBody TaskRequest req) {
        Task task = taskService.createTask(req);
        return ResponseEntity.ok(Map.of("status", "success", "data", task));
    }

    // Get All Tasks (USER, ADMIN, SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('USER','ADMIN','SUPER_ADMIN')")
    @GetMapping("/get_all_task")
    public ResponseEntity<?> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(Map.of("status", "success", "data", tasks));
    }

    // Get Task by ID (USER, ADMIN, SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('USER','ADMIN','SUPER_ADMIN')")
    @GetMapping("/get_task")
    public ResponseEntity<?> getTask(@RequestParam Long id) {
        return taskService.getTask(id)
                .map(task -> ResponseEntity.ok(Map.of("status", "success", "data", task)))
                .orElse(ResponseEntity.status(404).body(Map.of("status", "error", "message", "Task not found")));
    }

    // Patch Task (ADMIN, SUPER_ADMIN only)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @PatchMapping("/patch_task")
    public ResponseEntity<?> patchTask(@RequestParam Long id, @RequestBody TaskRequest req) {
        try {
            return taskService.updateTask(id, req)
                    .map(task -> ResponseEntity.ok(Map.of("status", "success", "data", task)))
                    .orElse(ResponseEntity.status(404).body(Map.of("status", "error", "message", "Task not found")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // Delete Task (SUPER_ADMIN only)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/delete_task")
    public ResponseEntity<?> deleteTask(@RequestParam Long id) {
        if (taskService.deleteTask(id)) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Task deleted"));
        }
        return ResponseEntity.status(404).body(Map.of("status", "error", "message", "Task not found"));
    }
}
