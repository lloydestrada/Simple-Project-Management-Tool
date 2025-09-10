package com.simple.pmtool.Service;

import com.simple.pmtool.DTO.TaskRequest;
import com.simple.pmtool.Model.Task;
import com.simple.pmtool.Model.Project;
import com.simple.pmtool.Repository.TaskRepository;
import com.simple.pmtool.Repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Create Task
    public Task createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProject_id())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = new Task();
        task.setProject(project);
        task.setName(request.getName());
        task.setStatus(request.getStatus());
        task.setContents(request.getContents());

        return taskRepository.save(task);
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get single task
    public Optional<Task> getTask(Long id) {
        return taskRepository.findById(id);
    }

    // Update Task (Patch)
    public Optional<Task> updateTask(Long id, TaskRequest request) {
        return taskRepository.findById(id).map(task -> {
            if (request.getName() != null) task.setName(request.getName());
            if (request.getStatus() != null) task.setStatus(request.getStatus());
            if (request.getContents() != null) task.setContents(request.getContents());
            return taskRepository.save(task);
        });
    }

    // Delete Task
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
