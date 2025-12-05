"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginHandler } from "@/handlers/authHandler";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await loginHandler({ email, password });
      console.log("Login response:", res);

      // ➜ 1️⃣ Check for Error first (if handler returns an error object)
      if (res.status >= 400) {
        setMessage(res.message);
        return;
      }

      // ➜ 2️⃣ Check if MFA is required
      // NOTE: We don't pass user_id anymore. The cookie holds that info.
      if (res.data?.step === "mfa_required") {
        router.push("/mfa/verify-login"); 
        return;
      }

      // ➜ 3️⃣ Normal login (No MFA)
      // NOTE: No localStorage.setItem here! The cookie is already set.
      if (res.data?.token || res.message === "Logged in successfully") {
        router.push("/"); // Redirect to dashboard
        return;
      }

    } catch (error) {
      console.log("Error logging in:", error);
      setMessage("Login failed");
    }
  };

  return (
    <form className="grid place-items-center h-screen bg-gray-50">
      <div className="p-8 text-center space-y-4 bg-white shadow-lg rounded-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Login
        </button>
        {message && <p className="mt-2 text-center text-sm">{message}</p>}
      </div>
    </form>
  );
};

export default LoginForm;