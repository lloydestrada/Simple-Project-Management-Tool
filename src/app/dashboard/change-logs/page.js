"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getChangeLogs } from "@/app/services/changeLogService";

export default function ChangeLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await getChangeLogs();
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      // Sort descending by changedAt so newest logs appear first
      const sortedLogs = data.sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
      );
      setLogs(sortedLogs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load change logs.");
      setLoading(false);
    }
  };

  // Format status text (IN_PROGRESS -> In Progress)
  const formatStatus = (status) => {
    if (!status) return "N/A";
    return status
      .toLowerCase()
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Assign colors based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Change Logs</h1>

        <button
          onClick={() => router.push("/dashboard/change-logs/add")}
          className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
        >
          Add Change Log
        </button>

        {loading && <p className="text-gray-500">Loading logs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
            <table className="min-w-full table-fixed divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Old Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    New Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Changed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-all duration-300"
                    >
                      <td className="px-6 py-4 text-gray-900">{log.taskId}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-4 py-2 rounded-lg text-base font-bold ${getStatusColor(
                            log.oldStatus
                          )}`}
                        >
                          {formatStatus(log.oldStatus)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-4 py-2 rounded-lg text-base font-bold ${getStatusColor(
                            log.newStatus
                          )}`}
                        >
                          {formatStatus(log.newStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{log.remark}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(log.changedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No change logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
