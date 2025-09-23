"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getMembers, deleteMember } from "@/app/services/memberService";
import { getCurrentUser } from "@/lib/auth";

// Reusable Table Component
function DataTable({ columns, data, currentUser, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${col.width}`}
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-all duration-300"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-gray-900">
                    {item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 flex gap-2">
                  {/* Only show actions for ADMIN or SUPER_ADMIN */}
                  {(currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ADMIN") && (
                    <>
                      <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow"
                      >
                        Update
                      </button>

                      {currentUser?.role === "SUPER_ADMIN" && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const columns = [
    { key: "user_id", label: "User ID", width: "w-[100px]" },
    { key: "username", label: "Username", width: "w-[150px]" },
    { key: "email", label: "Email", width: "w-[200px]" },
    { key: "role", label: "Role", width: "w-[150px]" },
  ];

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({
        ...user,
        role: user.role?.toUpperCase(),
        user_id: user.user_id || user.id,
      });
    }
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        const normalizedMembers = res.data.data.map((m) => ({
          ...m,
          user_id: m.user_id || m.id,
          id: m.id,
        }));
        setMembers(normalizedMembers);
      } catch (err) {
        console.error(err);
        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  const handleEdit = (member) => {
    router.push(`/dashboard/members/edit/${member.id}`); // pass numeric ID
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>

        {currentUser &&
          (currentUser.role === "ADMIN" ||
            currentUser.role === "SUPER_ADMIN") && (
            <button
              onClick={() => router.push("/dashboard/members/add")}
              className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
            >
              Add Member
            </button>
          )}

        {loading && <p className="text-gray-500">Loading members...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && currentUser && (
          <DataTable
            columns={columns}
            data={members}
            currentUser={currentUser}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
