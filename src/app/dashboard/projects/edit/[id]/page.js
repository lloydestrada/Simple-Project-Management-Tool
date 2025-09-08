"use client";

import { useState, useEffect, use } from "react"; // <-- import use
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getProject, updateProject } from "@/app/services/projectService";
import { getMembers } from "@/app/services/memberService";

export default function EditProjectPage({ params }) {
  const router = useRouter();

  // Unwrap params Promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(id);
        const data = res.data.data;
        setName(data.name || "");
        setDescription(data.description || "");
        setUserId(data.user_id || "");
      } catch (err) {
        console.error(err);
        setMessage("Failed to load project.");
        setIsError(true);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProject(id, {
        name,
        description,
        user_id: userId,
      });
      if (res.data?.data) {
        setMessage("Project updated successfully!");
        setIsError(false);
        setTimeout(() => router.push("/dashboard/projects"), 1000);
      } else {
        setMessage("Failed to update project.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error updating project");
      setIsError(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Edit Project
          </h1>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                rows={4}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Owner (User ID)
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.user_id}>
                    {member.user_id} - {member.username}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Update Project
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-3 rounded-lg text-center font-medium ${
                isError
                  ? "bg-red-100 text-red-700 border border-red-400"
                  : "bg-green-100 text-green-700 border border-green-400"
              }`}
            >
              {message}
            </div>
          )}
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
