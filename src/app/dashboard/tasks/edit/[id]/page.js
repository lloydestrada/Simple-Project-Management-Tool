"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getTask, updateTask } from "@/app/services/taskService";
import { getProjects } from "@/app/services/projectService";

export default function EditTaskPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params); // unwrap the Promise
  const taskId = resolvedParams.id;

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    project_id: "",
    name: "",
    status: "PENDING",
    contents: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    // Fetch projects
    getProjects()
      .then((res) => setProjects(res.data.data))
      .catch(() => {
        setMessage("Failed to load projects.");
        setMessageType("error");
      });

    // Fetch task by id
    if (taskId) {
      getTask(taskId)
        .then((res) => {
          if (res.data.status === "success") {
            setForm(res.data.data);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(taskId, form);
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
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Edit Task</h1>

          {message && (
            <p
              className={`mb-4 p-2 rounded text-white ${
                messageType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Select */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Project
              </label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                required
              >
                <option value="">-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Task Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Contents */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Contents
              </label>
              <textarea
                name="contents"
                value={form.contents}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard/tasks")}
                className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
