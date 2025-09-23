"use client";

import { useState, useEffect } from "react";

export default function TaskForm({
  form,
  setForm,
  projects,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const [userRole, setUserRole] = useState("");

  // SSR safe access to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("role") || "");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isReadOnly = userRole === "USER"; // users cannot edit

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Project Select */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Project</label>
        <select
          name="project_id"
          value={form.project_id}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
          required
          disabled={isReadOnly}
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
          required
          readOnly={isReadOnly}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
          disabled={isReadOnly}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Contents */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Contents</label>
        <textarea
          name="contents"
          value={form.contents}
          onChange={handleChange}
          className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
          rows={3}
          readOnly={isReadOnly}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        {!isReadOnly && (
          <button
            type="submit"
            className="w-1/2 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            {submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}
