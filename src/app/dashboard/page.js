"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { getMembers } from "@/app/services/memberService";
import { getProjects } from "@/app/services/projectService";
import { getTasks } from "@/app/services/taskService";
import { isSuperUser } from "@/lib/auth";

export default function DashboardHome() {
  const [user, setUser] = useState({ username: "User" });
  const [stats, setStats] = useState({
    members: 0,
    projects: 0,
    tasks: 0,
    changeLogs: 0,
    membersList: [],
  });
  const [recentActivities, setRecentActivities] = useState({
    members: [],
    projects: [],
    tasks: [],
  });
  const [superUser, setSuperUser] = useState(false);

  useEffect(() => {
    // Client-side only: get stored user
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Check if current user is superuser
    setSuperUser(isSuperUser());

    const fetchStatsAndActivities = async () => {
      try {
        const [membersRes, projectsRes, tasksRes] = await Promise.all([
          getMembers(),
          getProjects(),
          getTasks(),
        ]);

        // Prepare recent activities
        const memberActs = membersRes.data.data.slice(-5).map((m) => ({
          id: `member-${m.id}`,
          text: `${m.username} joined the team`,
        }));

        const projectActs = projectsRes.data.data.slice(-5).map((p) => ({
          id: `project-${p.id}`,
          text: `Project "${p.name}" was created`,
        }));

        const taskActs = tasksRes.data.data.slice(-5).map((t) => ({
          id: `task-${t.id}`,
          text: `Task "${t.name}" was added to Project ID ${t.project_id}`,
        }));

        setRecentActivities({
          members: memberActs,
          projects: projectActs,
          tasks: taskActs,
        });

        // Set stats dynamically
        setStats({
          members: membersRes.data.data.length,
          projects: projectsRes.data.data.length,
          tasks: tasksRes.data.data.length,
          changeLogs: memberActs.length + projectActs.length + taskActs.length,
          membersList: membersRes.data.data,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatsAndActivities();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col space-y-8">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {user.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            This is a Simple Management Tool Dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid gap-6 ${
            superUser
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center"
          }`}
        >
          <StatCard
            title="Members"
            value={stats.members}
            color="from-blue-500 to-blue-700"
          />
          <StatCard
            title="Projects"
            value={stats.projects}
            color="from-green-500 to-green-700"
          />
          <StatCard
            title="Tasks"
            value={stats.tasks}
            color="from-yellow-500 to-yellow-600"
          />
          {superUser && (
            <StatCard
              title="Change Logs"
              value={stats.changeLogs}
              color="from-purple-500 to-purple-700"
            />
          )}
        </div>

        {/* Quick Actions */}
        {(superUser) && (
          <div className="flex flex-wrap gap-4 justify-center">
            {superUser && (
              <ActionButton
                label="Add Member"
                onClick={() =>
                  (window.location.href = "/dashboard/members/add")
                }
              />
            )}
            <ActionButton
              label="Add Project"
              onClick={() => (window.location.href = "/dashboard/projects/add")}
            />
            <ActionButton
              label="Add Task"
              onClick={() => (window.location.href = "/dashboard/tasks/add")}
            />
          </div>
        )}

        {/* Main Grid: Activities & Team */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Recent Activity
            </h2>

            {recentActivities.members.length > 0 && (
              <>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Members
                </h3>
                <ul className="space-y-2 mb-4">
                  {recentActivities.members.map((act) => (
                    <li
                      key={act.id}
                      className="p-3 bg-gray-50 text-gray-800 rounded-xl border-l-4 border-blue-500 hover:bg-gray-100 transition"
                    >
                      {act.text}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {recentActivities.projects.length > 0 && (
              <>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Projects
                </h3>
                <ul className="space-y-2 mb-4">
                  {recentActivities.projects.map((act) => (
                    <li
                      key={act.id}
                      className="p-3 bg-gray-50 text-gray-800 rounded-xl border-l-4 border-green-500 hover:bg-gray-100 transition"
                    >
                      {act.text}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {recentActivities.tasks.length > 0 && (
              <>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Tasks
                </h3>
                <ul className="space-y-2">
                  {recentActivities.tasks.map((act) => (
                    <li
                      key={act.id}
                      className="p-3 bg-gray-50 text-gray-800 rounded-xl border-l-4 border-yellow-500 hover:bg-gray-100 transition"
                    >
                      {act.text}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {recentActivities.members.length === 0 &&
              recentActivities.projects.length === 0 &&
              recentActivities.tasks.length === 0 && (
                <p className="text-gray-500">No recent activities</p>
              )}
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Team Members
            </h2>
            <ul className="flex flex-wrap gap-4">
              {stats.membersList.length > 0 ? (
                stats.membersList.map((member) => (
                  <li key={member.id} className="flex flex-col items-center">
                    <span className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700">
                      {member.username
                        ? member.username.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                    <span className="mt-2 text-gray-700 text-sm">
                      {member.username}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No members found.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Stats Card Component
function StatCard({ title, value, color }) {
  return (
    <div
      className={`rounded-2xl shadow p-6 text-white bg-gradient-to-r ${color} transform hover:scale-105 transition flex flex-col items-center`}
    >
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
