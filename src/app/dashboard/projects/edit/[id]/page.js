"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ProjectForm from "@/components/ProjectForm";
import { getProject, updateProject } from "@/app/services/projectService";
import { getMembers } from "@/app/services/memberService";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [initialData, setInitialData] = useState({});
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(id);
        const data = res.data.data;

        setInitialData({
          name: data.name,
          description: data.description,
          ownerId: data.owner_id,
          assignedMembers: data.assignedMembers
            ? data.assignedMembers.map((m) => m.user_id)
            : [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load project.");
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        setMembers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProject();
    fetchMembers();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const res = await updateProject(id, {
        name: formData.name,
        description: formData.description,
        ownerId: formData.ownerId, 
        assignedMemberIds: formData.assignedMembers,
      });

      if (res.data?.data) {
        alert("Project updated successfully!");
        router.push("/dashboard/projects");
      } else {
        alert("Failed to update project.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating project");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Edit Project
          </h1>

          <ProjectForm
            initialData={initialData}
            onSubmit={handleUpdate}
            members={members}
          />
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            &larr; Back
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
