package com.simple.pmtool.DTO;

import java.util.List;

public class ProjectRequest {

    private String ownerId;
    private String name;
    private String description;
    private List<String> assignedMemberIds;

    // Getters and setters
    public String getOwnerId() {
        return ownerId;
    }
    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAssignedMemberIds() {
        return assignedMemberIds;
    }
    public void setAssignedMemberIds(List<String> assignedMemberIds) {
        this.assignedMemberIds = assignedMemberIds;
    }

    @Override
    public String toString() {
        return "ProjectRequest{" +
                "ownerId='" + ownerId + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", assignedMemberIds=" + assignedMemberIds +
                '}';
    }
}
