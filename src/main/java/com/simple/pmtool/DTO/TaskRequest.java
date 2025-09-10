package com.simple.pmtool.DTO;

public class TaskRequest {
    private Long project_id;
    private String name;
    private String status;
    private String contents;

    public Long getProject_id() {
        return project_id;
    }

    public void setProject_id(Long project_id) {
        this.project_id = project_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    @Override
    public String toString() {
        return "TaskRequest{" +
                "project_id=" + project_id +
                ", name='" + name + '\'' +
                ", status='" + status + '\'' +
                ", contents='" + contents + '\'' +
                '}';
    }
}
