"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MFAverifyLogin() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isExpired, setIsExpired] = useState(false); // New state for expiration
  const router = useRouter();

  const verifyCode = async () => {
    setLoading(true);
    setErrorMsg(""); // Clear previous errors

    try {
      await axios.post("/api/mfa/verify-login", { code });
      
      // Success! Browser has the access_token cookie now.
      router.push("/"); 

    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Verification Failed";

      if (status === 401) {
        // ➜ CRITICAL: Handle Session Expiry specifically
        setIsExpired(true);
        setErrorMsg("Your login session has expired. Please login again.");
      } else {
        // Handle normal errors (wrong code, etc.)
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ➜ If Session is Expired, show this UI instead of the input form
  if (isExpired) {
    return (
      <div className="grid place-items-center h-screen bg-gray-50">
        <div className="p-8 text-center space-y-4 bg-white shadow-xl rounded-xl border border-red-100 max-w-sm">
          <div className="text-red-500 text-5xl">⏰</div>
          <h2 className="text-xl font-bold text-gray-800">Session Expired</h2>
          <p className="text-gray-500">
            For your security, the verification session times out after 5 minutes.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ➜ Normal UI
  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="p-8 text-center space-y-6 bg-white shadow-lg rounded-xl max-w-sm w-full">
        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="text-gray-500 text-sm">
          Enter the 6-digit code from your authenticator app.
        </p>

        <input
          placeholder="000 000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className="text-center text-2xl tracking-widest border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button 
          onClick={verifyCode} 
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Verifying..." : "Verify Login"}
        </button>
      </div>
    </div>
  );
}