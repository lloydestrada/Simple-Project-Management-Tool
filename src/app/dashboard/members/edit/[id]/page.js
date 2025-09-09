"use client";

import { useState, useEffect, use } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getMember, updateMember } from "@/app/services/memberService";

export default function UpdateMemberPage({ params }) {
  const router = useRouter();

  // Unwrap params Promise
  const { id } = use(params);

  const [formData, setFormData] = useState({
    user_id: "",
    username: "",
    email: "",
    old_password: "",
    new_password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Fetch member data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMember(id);
        if (res.data?.data) {
          const data = res.data.data;
          setFormData({
            user_id: data.user_id || "",
            username: data.username || "",
            email: data.email || "",
            old_password: data.password || "",
            new_password: "",
          });
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch member data.");
        setIsError(true);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMember(id, formData);
      if (res.data?.data) {
        setMessage("Member updated successfully!");
        setIsError(false);
        setTimeout(() => router.push("/dashboard/members"), 1000);
      } else {
        setMessage("Failed to update member.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || err.message);
      setIsError(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Update Member
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
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
                name="username"
                value={formData.username}
                onChange={handleChange}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
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
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Update Member
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

        {/* Back Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/dashboard/members")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            &larr; Back
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
