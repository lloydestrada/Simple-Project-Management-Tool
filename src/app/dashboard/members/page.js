"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { getMembers, deleteMember } from "@/app/services/memberService";


export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMembers()
      .then((res) => {
        setMembers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load members.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>

        <button
          onClick={() => router.push("/dashboard/members/add")}
          className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
        >
          Add Member
        </button>

        {loading && <p className="text-gray-500">Loading members...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 mt-2">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="px-6 py-4 text-gray-900 min-w-[150px]">
                      {member.user_id}
                    </td>
                    <td className="px-6 py-4 text-gray-900 min-w-[150px]">
                      {member.username}
                    </td>
                    <td className="px-6 py-4 text-gray-900 min-w-[200px]">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 flex gap-2 min-w-[200px]">
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
                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No members found.
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
