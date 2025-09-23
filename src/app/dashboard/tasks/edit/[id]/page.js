"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import TaskForm from "@/components/TaskForm";
import { getTask, updateTask } from "@/app/services/taskService";
import { getProjects } from "@/app/services/projectService";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [form, setForm] = useState({
    project_id: "",
    name: "",
    status: "PENDING",
    contents: "",
  });

  useEffect(() => {
    // Fetch projects
    getProjects()
      .then((res) => setProjects(res.data.data || []))
      .catch(() => {
        setMessage("Failed to load projects.");
        setMessageType("error");
      });

    // Fetch task by ID
    if (taskId) {
      getTask(taskId)
        .then((res) => {
          if (res.data.status === "success") {
            const task = res.data.data;
            setForm({
              project_id: task.project?.id ? String(task.project.id) : "",
              name: task.name || "",
              status: task.status || "PENDING",
              contents: task.contents || "",
            });
          } else {
            setMessage("Task not found.");
            setMessageType("error");
          }
        })
        .catch(() => {
          setMessage("Failed to load task.");
          setMessageType("error");
        });
    }
  }, [taskId]);

  const handleSubmit = async (formData) => {
    try {
      await updateTask(taskId, formData);
      setMessage("Task updated successfully!");
      setMessageType("success");
      setTimeout(() => router.push("/dashboard/tasks"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update task.");
      setMessageType("error");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen py-10 bg-gray-100">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 text-center">
            Edit Task
          </h1>

          {message && (
            <p
              className={`mb-4 p-2 rounded text-white ${
                messageType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <TaskForm
            form={form}
            setForm={setForm}
            projects={projects}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(form);
            }}
            onCancel={() => router.push("/dashboard/tasks")}
            submitLabel="Update Task"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
