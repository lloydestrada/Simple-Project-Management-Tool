"use client";
import { jwtDecode } from "jwt-decode";

export function getCurrentUser() {
  if (typeof window === "undefined") return null; // SSR safe
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      user_id: decoded.user_id || decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (err) {
    console.error("[auth.js] Failed to decode token:", err);
    return null;
  }
}

export function isSuperUser() {
  const user = getCurrentUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "SUPERADMIN";
}
