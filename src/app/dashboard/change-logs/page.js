"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getChangeLogs } from "@/app/services/changeLogService";
import { getCurrentUser } from "@/lib/auth";

export default function ChangeLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({ ...user, role: user.role?.toUpperCase() });
    }
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await getChangeLogs();
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const sortedLogs = data.sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
      );
      setLogs(sortedLogs);
    } catch (err) {
      console.error(err);
      setError("Failed to load change logs.");
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "N/A";
    return status
      .toLowerCase()
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

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

  const columns = [
    { header: "Task ID", accessor: "taskId" },
    {
      header: "Old Status",
      accessor: "oldStatus",
      render: (status) => (
        <span
          className={`inline-block px-4 py-2 rounded-lg text-base font-bold ${getStatusColor(
            status
          )}`}
        >
          {formatStatus(status)}
        </span>
      ),
    },
    {
      header: "New Status",
      accessor: "newStatus",
      render: (status) => (
        <span
          className={`inline-block px-4 py-2 rounded-lg text-base font-bold ${getStatusColor(
            status
          )}`}
        >
          {formatStatus(status)}
        </span>
      ),
    },
    { header: "Remark", accessor: "remark" },
    {
      header: "Changed At",
      accessor: "changedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Change Logs</h1>

        {currentUser?.role === "SUPER_ADMIN" && (
          <button
            onClick={() => router.push("/dashboard/change-logs/add")}
            className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
          >
            Add Change Log
          </button>
        )}

        {loading && <p className="text-gray-500">Loading logs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <DataTable
            data={logs}
            columns={columns}
            getRowKey={(log) => log.id}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
