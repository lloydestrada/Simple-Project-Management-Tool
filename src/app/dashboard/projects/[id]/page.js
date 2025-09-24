"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getProject } from "@/app/services/projectService";
import { getMembers } from "@/app/services/memberService";
import { getCurrentUser } from "@/lib/auth";

export default function ViewProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({
        ...user,
        role: user.role?.toUpperCase(),
        user_id: user.user_id || user.id,
      });
    }
  }, []);

  // Fetch project and members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, membersRes] = await Promise.all([
          getProject(projectId),
          getMembers(),
        ]);

        const proj = projRes.data.data;
        const members = membersRes.data.data || [];
        setAllMembers(members);

        // Map assigned members
        const assignedMembers =
          proj.assignedMembers && proj.assignedMembers.length > 0
            ? proj.assignedMembers
                .map((m) => {
                  if (typeof m === "object") return m; // already object
                  return members.find(
                    (mem) => String(mem.user_id) === String(m)
                  );
                })
                .filter(Boolean)
            : [];

        // Map owner
        let owner_name = "N/A";
        if (proj.owner_name) {
          owner_name = proj.owner_name;
        } else if (proj.ownerId) {
          const ownerObj = members.find(
            (m) => String(m.user_id) === String(proj.ownerId)
          );
          owner_name = ownerObj ? ownerObj.username : "N/A";
        }

        setProject({
          ...proj,
          assignedMembers,
          owner_name,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) return <p className="text-black">Loading project...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p className="text-black">Project not found.</p>;
 
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-black">{project.name}</h1>

        {/* Owner */}
        <p className="text-black mb-2">
          <span className="font-semibold">Owner:</span> {project.owner_name}
        </p>

        {/* Description */}
        <p className="text-black mb-4">
          <span className="font-semibold block mb-1">Description</span>
          <span className="block break-words whitespace-pre-wrap">
            {project.description || "N/A"}
          </span>
        </p>

        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="px-5 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
          >
            &larr; Back
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
