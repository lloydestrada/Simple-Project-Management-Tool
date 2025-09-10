"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getTasks, deleteTask } from "@/app/services/taskService";
import { getProjects } from "@/app/services/projectService";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getTasks(), getProjects()])
      .then(([taskRes, projectRes]) => {
        setTasks(taskRes.data.data);
        setProjects(projectRes.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load tasks or projects.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };



  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

        <button
          onClick={() => router.push("/dashboard/tasks/add")}
          className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
        >
          Add Task
        </button>

        {loading && <p className="text-gray-500">Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Project ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4 text-gray-900">{task.id}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {task.project ? task.project.id : "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {task.project ? task.project.name : "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-semibold ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{task.contents}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/tasks/edit/${task.id}`)
                        }
                        className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
