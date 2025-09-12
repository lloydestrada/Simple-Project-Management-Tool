package com.simple.pmtool.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "change_log")
public class ChangeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "old_value")
    private String oldStatus;

    @Column(name = "new_value")
    private String newStatus;

    @Column(name = "remark")
    private String remark;

    @Column(name = "details")
    private String details;

    @Column(name = "changed_at", updatable = false)
    private LocalDateTime changedAt = LocalDateTime.now();

    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getTaskId() {
        return taskId; }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getOldStatus() {
        return oldStatus;
    }
    public void setOldStatus(String oldStatus) {
        this.oldStatus = oldStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}
