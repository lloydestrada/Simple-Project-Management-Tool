"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { createMember } from "@/app/services/memberService";

export default function AddMemberPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    user_id: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createMember(formData);

      if (res.data?.data) {
        setMessage("Member added successfully!");
        setIsError(false);
        setTimeout(() => router.push("/dashboard/members"), 1500);
      } else {
        setMessage("Failed to add member.");
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
            Add Member
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {["user_id", "username", "email", "password"].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-medium text-gray-700">
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  type={
                    field === "password"
                      ? "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Add Member
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
