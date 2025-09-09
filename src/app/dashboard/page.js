"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { getMembers } from "@/app/services/memberService";
import { getProjects } from "@/app/services/projectService";

export default function DashboardHome({ user }) {
  const [stats, setStats] = useState({
    members: 0,
    projects: 0,
    tasks: 0,
    changeLogs: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Fetch counts
    const fetchStats = async () => {
      try {
        const membersRes = await getMembers();
        const projectsRes = await getProjects();
        const tasksRes = await getTasks(); // optional
        // Mock change logs or fetch if API exists
        setStats({
          members: membersRes.data.data.length,
          projects: projectsRes.data.data.length,
          tasks: tasksRes?.data?.data?.length || 0,
          changeLogs: 5, // replace with actual API if available
        });

        // Recent activities mockup
        setRecentActivities([
          { id: 1, text: "Alice created Project Alpha" },
          { id: 2, text: "Bob added Task 'Design UI'" },
          { id: 3, text: "Charlie updated Project Beta" },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {user?.username || "User"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your project management tool
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Members" value={stats.members} color="bg-blue-500" />
          <StatCard
            title="Projects"
            value={stats.projects}
            color="bg-green-500"
          />
          <StatCard title="Tasks" value={stats.tasks} color="bg-yellow-500" />
          <StatCard
            title="Change Logs"
            value={stats.changeLogs}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <ActionButton
            label="Add Project"
            onClick={() => (window.location.href = "/dashboard/projects/add")}
          />
          <ActionButton
            label="Add Task"
            onClick={() => (window.location.href = "/dashboard/tasks/add")}
          />
          <ActionButton
            label="Add Member"
            onClick={() => (window.location.href = "/dashboard/members/add")}
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {recentActivities.map((act) => (
              <li
                key={act.id}
                className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
              >
                {act.text}
              </li>
            ))}
            {recentActivities.length === 0 && (
              <li className="text-gray-500">No recent activities</li>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Stats Card Component
function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-2xl shadow p-6 text-white ${color}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

// Action Button Component
function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 bg-cyan-600 text-white rounded-xl shadow hover:bg-cyan-700 transition font-semibold"
    >
      {label}
    </button>
  );
}
