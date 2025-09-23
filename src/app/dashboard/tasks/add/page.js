"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import TaskForm from "@/components/TaskForm";
import { createTask } from "@/app/services/taskService";
import { getProjects } from "@/app/services/projectService";

// Initial form state (static)
const INITIAL_FORM = {
  project_id: "",
  name: "",
  status: "PENDING",
  contents: "",
};

export default function AddTaskPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch projects once on mount
  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data.data || []))
      .catch(() => {
        setMessage("Failed to load projects.");
        setMessageType("error");
      });
  }, []); // ✅ empty dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(form);
      setMessage("Task created successfully!");
      setMessageType("success");
      setTimeout(() => router.push("/dashboard/tasks"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create task.");
      setMessageType("error");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Add New Task
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

          {/* Use the reusable TaskForm component */}
          <TaskForm
            form={form}
            setForm={setForm}
            projects={projects}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/tasks")}
            submitLabel="Save Task"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
