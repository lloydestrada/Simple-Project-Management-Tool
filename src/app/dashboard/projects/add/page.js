"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getMembers } from "@/app/services/memberService";
import { createProject } from "@/app/services/projectService";
import ProjectForm from "@/components/ProjectForm";

export default function AddProjectPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        setMembers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const res = await createProject({
        name: formData.name,
        description: formData.description,
        assignedMemberIds: formData.assignedMembers,
      });

      if (res.data?.data) {
        // Navigate to projects page after success
        router.push("/dashboard/projects");
        return res.data.data; 
      } else {
        throw new Error("Failed to add project");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Add Project
          </h1>

          {/* Use ProjectForm component */}
          <ProjectForm
            initialData={{}}
            onSubmit={handleSubmit}
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
