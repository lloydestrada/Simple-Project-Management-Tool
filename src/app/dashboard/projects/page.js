"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getProjects, deleteProject } from "@/app/services/projectService";
import { getMembers } from "@/app/services/memberService";
import { getCurrentUser } from "@/lib/auth";

// Reusable Table Component
function DataTable({
  columns,
  data,
  currentUser,
  allMembers,
  onEdit,
  onDelete,
}) {
  const router = useRouter();

  const getAssignedUsernames = (project) => {
    if (!project.assignedMembers || project.assignedMembers.length === 0)
      return "N/A";

    return project.assignedMembers
      .map((idOrUsername) => {
        const member = allMembers.find(
          (m) =>
            String(m.user_id) === String(idOrUsername) ||
            String(m.username) === String(idOrUsername)
        );
        return member ? member.username : idOrUsername;
      })
      .join(", ");
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${col.width}`}
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[250px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-all duration-300"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-black">
                    {col.key === "assignedMembers"
                      ? getAssignedUsernames(item)
                      : item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 flex gap-2">
                  {/* View Full button always visible */}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/projects/${item.id}`)
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition shadow"
                  >
                    View Full
                  </button>

                  {/* Only admins see update/delete */}
                  {(currentUser?.role === "SUPER_ADMIN" ||
                    currentUser?.role === "ADMIN") && (
                    <>
                      <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow"
                      >
                        Update
                      </button>
                      {currentUser?.role === "SUPER_ADMIN" && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const columns = [
    { key: "name", label: "Project Name", width: "w-[150px]" },
    { key: "description", label: "Description", width: "w-[250px]" },
    { key: "owner_name", label: "Owner", width: "w-[150px]" },
    { key: "assignedMembers", label: "Assigned Members", width: "w-[200px]" },
  ];

  // Get current user
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({
        ...user,
        role: user.role?.toUpperCase(),
        user_id: user.user_id || user.id,
        username: user.username,
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersRes = await getMembers();
        const members = membersRes.data.data || [];
        setAllMembers(members);

        const projectsRes = await getProjects();
        let normalized = projectsRes.data.data.map((p) => ({
          ...p,
          id: p.id,
          assignedMembers: Array.isArray(p.assignedMembers)
            ? p.assignedMembers
            : typeof p.assignedMembers === "string"
            ? p.assignedMembers.split(",").map((s) => s.trim())
            : [],
        }));

        // No filtering for USER, all projects visible
        setProjects(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchData();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  const handleEdit = (project) => {
    router.push(`/dashboard/projects/edit/${project.id}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>

        {currentUser &&
          (currentUser.role === "ADMIN" ||
            currentUser.role === "SUPER_ADMIN") && (
            <button
              onClick={() => router.push("/dashboard/projects/add")}
              className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
            >
              Add Project
            </button>
          )}

        {loading && <p className="text-gray-500">Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && currentUser && (
          <DataTable
            columns={columns}
            data={projects}
            currentUser={currentUser}
            allMembers={allMembers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
