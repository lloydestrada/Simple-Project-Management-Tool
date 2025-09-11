"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/"); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between min-h-screen">
        {/* Top Navigation */}
        <div>
          <div className="text-3xl font-bold p-6 text-cyan-500">PMT</div>
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/dashboard" className="p-2 rounded hover:bg-gray-700 font-medium">
              Home
            </Link>
            <Link href="/dashboard/members" className="p-2 rounded hover:bg-gray-700 font-medium">
              Members
            </Link>
            <Link href="/dashboard/projects" className="p-2 rounded hover:bg-gray-700 font-medium">
              Projects
            </Link>
            <Link href="/dashboard/tasks" className="p-2 rounded hover:bg-gray-700 font-medium">
              Tasks
            </Link>
            <Link href="/dashboard/change-logs" className="p-2 rounded hover:bg-gray-700 font-medium">
              Change Logs
            </Link>
          </nav>
        </div>

        {/* Logout Button at bottom */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
