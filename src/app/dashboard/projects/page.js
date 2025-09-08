"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getProjects, deleteProject } from "@/app/services/projectService";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>

        <button
          onClick={() => router.push("/dashboard/projects/add")}
          className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
        >
          Add Project
        </button>

        {loading && <p className="text-gray-500">Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[100px]">
                    Project ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">
                    Owner (User ID)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-all duration-300">
                    <td className="px-6 py-4 text-gray-900">{project.id}</td>
                    <td className="px-6 py-4 text-gray-900">{project.user_id}</td>
                    <td className="px-6 py-4 text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 text-gray-900">{project.description}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/projects/edit/${project.id}`)}
                        className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
