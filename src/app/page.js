"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/loginService";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ userId, password });
      const data = res.data;

      setMessage(data.message);
      setSuccess(data.success);

      if (data.success) {
        localStorage.setItem("token", data.token); // Store JWT
        router.push("/dashboard"); 
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(error.response.data.message || "Login failed");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Project Tool Management
        </h1>
        <p className="text-center text-gray-500 mb-8">Enter your credentials</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {message && (
          <div
            className={`p-3 mt-4 rounded text-center font-medium ${
              success ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-center mt-4 text-gray-800">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </p>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Project Management Tool Assessment
        </p>
      </div>
    </div>
  );
}
