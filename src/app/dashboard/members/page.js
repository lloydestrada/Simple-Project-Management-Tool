"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/test01/get_all_member"
      );
      setMembers(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load members.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`http://localhost:8080/test01/delete_member?id=${id}`);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>

        {/* Add Member Button */}
        <button
          onClick={() => router.push("/dashboard/members/add")}
          className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
        >
          Add Member
        </button>

        {loading && <p className="text-gray-500">Loading members...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Members Table */}
        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  {["User ID", "Username", "Email", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr
                    key={member.user_id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900">
                      {member.user_id}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {member.username}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{member.email}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/members/edit/${member.id}`)
                        }
                        className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
