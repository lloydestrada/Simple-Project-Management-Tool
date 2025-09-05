import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-start h-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 mt-8">
          Welcome to Project Management Tool
        </h1>
        <p className="text-gray-700">
          Select a section from the sidebar to start managing your projects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Members
            </h2>
            <p className="text-gray-500">Total: 3</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Projects
            </h2>
            <p className="text-gray-500">Total: 0</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Tasks</h2>
            <p className="text-gray-500">Total: 0</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Change Logs
            </h2>
            <p className="text-gray-500">Total: 0</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
