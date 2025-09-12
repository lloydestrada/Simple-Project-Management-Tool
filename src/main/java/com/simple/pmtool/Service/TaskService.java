package com.simple.pmtool.Service;

import com.simple.pmtool.DTO.TaskRequest;
import com.simple.pmtool.Model.Task;
import com.simple.pmtool.Model.Project;
import com.simple.pmtool.Model.ChangeLog;
import com.simple.pmtool.Repository.TaskRepository;
import com.simple.pmtool.Repository.ProjectRepository;
import com.simple.pmtool.Repository.ChangeLogRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ChangeLogRepository changeLogRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       ChangeLogRepository changeLogRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.changeLogRepository = changeLogRepository;
    }

    // CREATE
    public Task createTask(TaskRequest req) {
        Project project = projectRepository.findById(req.getProject_id())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = new Task();
        task.setProject(project);
        task.setName(req.getName());
        task.setStatus(req.getStatus());
        task.setContents(req.getContents());

        Task saved = taskRepository.save(task);

        // Log creation with status
        createLog(
                saved.getId(),
                "CREATED",
                null,           // oldStatus is null for new task
                saved.getStatus(),  // newStatus = current status
                "Task created: " + saved.getName()
        );

        return saved;
    }


    // READ
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTask(Long id) {
        return taskRepository.findById(id);
    }

    // UPDATE
    public Optional<Task> updateTask(Long id, TaskRequest req) {
        return taskRepository.findById(id).map(task -> {
            StringBuilder changes = new StringBuilder();
            String oldStatus = task.getStatus();
            String newStatus = oldStatus;

            // Validate status
            List<String> allowedStatuses = List.of("PENDING", "IN_PROGRESS", "COMPLETED");
            if (req.getStatus() != null && !allowedStatuses.contains(req.getStatus())) {
                throw new RuntimeException("Invalid status: " + req.getStatus());
            }

            // Update name
            if (req.getName() != null && !req.getName().equals(task.getName())) {
                changes.append("Name changed from '").append(task.getName()).append("' to '").append(req.getName()).append("'. ");
                task.setName(req.getName());
            }

            // Update status
            if (req.getStatus() != null && !req.getStatus().equals(task.getStatus())) {
                changes.append("Status changed from '").append(task.getStatus()).append("' to '").append(req.getStatus()).append("'. ");
                task.setStatus(req.getStatus());
                newStatus = req.getStatus();
            }

            // Update contents
            if (req.getContents() != null && !req.getContents().equals(task.getContents())) {
                changes.append("Contents updated. ");
                task.setContents(req.getContents());
            }

            // Update project
            if (req.getProject_id() != null && !req.getProject_id().equals(task.getProject().getId())) {
                Project newProject = projectRepository.findById(req.getProject_id())
                        .orElseThrow(() -> new RuntimeException("Project not found"));
                changes.append("Project changed from '").append(task.getProject().getName())
                        .append("' to '").append(newProject.getName()).append("'. ");
                task.setProject(newProject);
            }

            Task updated = taskRepository.save(task);

            // Log changes
            if (!changes.toString().isEmpty()) {
                createLog(updated.getId(), "UPDATED", oldStatus, newStatus, changes.toString());
            }

            return updated;
        });
    }

    // DELETE
    public boolean deleteTask(Long id) {
        return taskRepository.findById(id).map(task -> {
            taskRepository.delete(task);
            return true;
        }).orElse(false);
    }


    // Private helper for logs
    private void createLog(Long taskId, String action, String oldStatus, String newStatus, String remark) {
        ChangeLog log = new ChangeLog();
        log.setTaskId(taskId);
        log.setAction(action);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setRemark(remark);

        // Set the current userId from the SecurityContext
        String currentUserId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.setUserId(currentUserId);

        changeLogRepository.save(log);
    }
}
