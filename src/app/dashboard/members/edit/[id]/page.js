"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter, useParams } from "next/navigation";
import MemberForm from "@/components/MemberForm";
import { getMember, updateMember } from "@/app/services/memberService";
import { getCurrentUser } from "@/lib/auth";

export default function UpdateMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    if (!id) {
      setMessage("Invalid member ID.");
      setIsError(true);
      setLoading(false);
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      setMessage("Invalid member ID.");
      setIsError(true);
      setLoading(false);
      return;
    }

    const fetchMember = async () => {
      try {
        const res = await getMember(numericId);
        if (res.data?.data) {
          const data = res.data.data;
          setInitialData({
            user_id: data.user_id || "",
            username: data.username || "",
            email: data.email || "",
            role: data.role || "USER",
          });
        } else {
          setMessage("Member not found.");
          setIsError(true);
        }
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.error || "Failed to fetch member data.");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const numericId = Number(id);
      const res = await updateMember(numericId, formData);

      if (res.data?.data) {
        setMessage("Member updated successfully!");
        setIsError(false);
        setTimeout(() => router.push("/dashboard/members"), 1500);
      } else {
        setMessage("Failed to update member.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || err.message);
      setIsError(true);
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading member data...</p>;

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Update Member
          </h1>

          {initialData && currentUser && (
            <MemberForm initialData={initialData} onSubmit={handleSubmit} />
          )}

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
