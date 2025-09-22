"use client";

import { useState, useEffect } from "react";

export default function ProjectForm({
  initialData = {},
  onSubmit,
  members = [],
  isEdit = false, // true for update mode
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ownerId: "",
    assignedMembers: [],
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Sync formData with initialData whenever initialData changes
  useEffect(() => {
    // Convert assigned member IDs and ownerId to strings for <select> matching
    let assigned = [];
    if (initialData.assignedMembers) {
      if (typeof initialData.assignedMembers[0] === "object") {
        assigned = initialData.assignedMembers.map((m) => String(m.user_id));
      } else {
        assigned = initialData.assignedMembers.map(String);
      }
    }

    setFormData({
      name: initialData.name || "",
      description: initialData.description || "",
      ownerId: initialData.ownerId ? String(initialData.ownerId) : "",
      assignedMembers: assigned,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, assignedMembers: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assignedMembers || formData.assignedMembers.length === 0) {
      setMessage("Please select at least one assigned member.");
      setIsError(true);
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      setMessage("Description cannot be empty.");
      setIsError(true);
      return;
    }

    try {
      await onSubmit(formData);
      setMessage(
        isEdit ? "Project updated successfully!" : "Project added successfully!"
      );
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || err.message);
      setIsError(true);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Project Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
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
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
          rows={4}
          required
        />
      </div>

      {/* Owner */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Owner</label>
        <select
          name="ownerId"
          value={formData.ownerId}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
          required
        >
          <option value="">Select Owner</option>
          {members.map((m) => (
            <option key={m.user_id} value={String(m.user_id)}>
              {m.username}
            </option>
          ))}
        </select>
      </div>

      {/* Assigned Members */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Assigned Members
        </label>
        <select
          multiple
          name="assignedMembers"
          value={formData.assignedMembers} // array of strings
          onChange={handleMultiSelectChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 text-gray-900"
        >
          {members.map((m) => (
            <option key={m.user_id} value={String(m.user_id)}>
              {m.username}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple members
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
      >
        {isEdit ? "Update Project" : "Add Project"}
      </button>

      {/* Message */}
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
