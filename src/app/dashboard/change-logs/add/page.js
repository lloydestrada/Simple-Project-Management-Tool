"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { createChangeLog } from "@/app/services/changeLogService";
import { getTasks } from "@/app/services/taskService";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export default function AddChangeLogPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    taskId: "",
    oldStatus: "",
    newStatus: "",
    remark: "",
    action: "STATUS_CHANGED", // default action
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  useEffect(() => {
    getTasks()
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.content || [];
        setTasks(data);
      })
      .catch(() => {
        setMessage("Failed to load tasks.");
        setMessageType("error");
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.taskId || !form.oldStatus || !form.newStatus) {
      setMessage("Please select task and statuses.");
      setMessageType("error");
      return;
    }

    try {
      await createChangeLog(form);
      setMessage("Change log created successfully!");
      setMessageType("success");
      setTimeout(() => router.push("/dashboard/change-logs"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create change log. Make sure you are logged in.");
      setMessageType("error");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Add Change Log
          </h1>

          {message && (
            <p
              className={`mb-4 p-2 rounded text-white ${
                messageType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Select */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Task
              </label>
              <select
                name="taskId"
                value={form.taskId}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                required
              >
                <option value="">-- Select Task --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || `Task ${t.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Old Status */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Old Status
              </label>
              <select
                name="oldStatus"
                value={form.oldStatus}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                required
              >
                <option value="">-- Select Old Status --</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* New Status */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                New Status
              </label>
              <select
                name="newStatus"
                value={form.newStatus}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                required
              >
                <option value="">-- Select New Status --</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Remark */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Remark
              </label>
              <textarea
                name="remark"
                value={form.remark}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-900 bg-white focus:ring focus:ring-cyan-300"
                rows={3}
                placeholder="Additional remarks..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard/change-logs")}
                className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
              >
                Save Log
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
