"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getMembers } from "@/app/services/memberService";
import { createProject } from "@/app/services/projectService";

export default function AddProjectPage() {
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers(); // uses memberService
        setMembers(res.data.data);
        if (res.data.data.length > 0) setUserId(res.data.data[0].user_id);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load members.");
        setIsError(true);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject({ userId, name, description });

      if (res.data?.data) {
        setMessage("Project added successfully!");
        setIsError(false);
        setTimeout(() => router.push("/dashboard/projects"), 1500);
      } else {
        setMessage("Failed to add project.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || err.message);
      setIsError(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Add Project
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* User ID select */}
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
                {members.map((member) => (
                  <option key={member.id} value={member.user_id}>
                    {member.user_id} - {member.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Name */}
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

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Add Project
            </button>
          </form>

          {/* Message Block */}
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

        {/* Back button */}
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
