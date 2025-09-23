"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

export default function MemberForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    user_id: "",
    username: "",
    email: "",
    password: "", // optional: only for admin reset
    role: "USER",
    ...initialData,
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({
        ...user,
        user_id: user.user_id || user.id,
        role: user.role?.toUpperCase(),
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: formData.user_id,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      password: formData.password || undefined, // optional password reset
    };

    try {
      await onSubmit(payload);
      setMessage("Operation successful!");
      setIsError(false);
      setFormData({ ...formData, password: "" }); // clear password field
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || err.message);
      setIsError(true);
    }
  };

  // Only show form for ADMIN/SUPER_ADMIN
  if (!currentUser || !["ADMIN", "SUPER_ADMIN"].includes(currentUser.role)) {
    return (
      <p className="text-center text-gray-500">
        You cannot update this member.
      </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {["user_id", "username", "email", "password"].map((field) => (
        <div key={field}>
          <label className="block mb-1 font-medium text-gray-700">
            {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </label>
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
            required={!initialData[field] && field !== "password"}
          />
        </div>
      ))}

      <div>
        <label className="block mb-1 font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
        >
          <option value="USER">USER</option>
          {currentUser?.role === "SUPER_ADMIN" && (
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          )}
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
      >
        Submit
      </button>

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
    </form>
  );
}
