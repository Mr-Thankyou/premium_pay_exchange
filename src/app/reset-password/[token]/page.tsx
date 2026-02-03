"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Both fields are required");

    if (password !== confirm) return toast.error("Passwords do not match");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
      }}
    >
      <div
        style={{
          background: "#111",
          padding: "30px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #333",
        }}
      >
        <h2
          style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}
        >
          Reset Your Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#000",
            color: "#fff",
          }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#000",
            color: "#fff",
          }}
        />

        <button
          onClick={handleReset}
          style={{
            width: "100%",
            padding: "12px",
            background: "#ff7a00",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
