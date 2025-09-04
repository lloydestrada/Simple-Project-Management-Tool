"use client";

import { useState, useEffect, use } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UpdateMemberPage({ params }) {
  const router = useRouter();

  // Use React.use() to unwrap params if it's a Promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/test01/get_member?id=${id}`
        );
        if (res.data?.data) {
          const data = res.data.data;
          setUserId(data.user_id || "");
          setUsername(data.username || "");
          setEmail(data.email || "");
          setOldPassword(data.password || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMember();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `http://localhost:8080/test01/update_member?id=${id}`,
        {
          user_id: userId,
          username,
          email,
          old_password: oldPassword,
          new_password: newPassword,
        }
      );

      if (res.data?.data) {
        setMessage("Member updated successfully!");
        setTimeout(() => router.push("/dashboard/members"), 1000);
      } else {
        setMessage("Failed to update member.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Update Member
          </h1>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                placeholder="Enter new password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Update Member
            </button>
          </form>
        </div>

        {/* Back button below the box */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/dashboard/members")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            &larr; Back
          </button>
        </div>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </DashboardLayout>
  );
}
