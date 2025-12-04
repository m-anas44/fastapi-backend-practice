"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SetupMFA() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await axios.get("/api/mfa/setup");
        setQr(res.data.data.qr);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching QR", err);
        if (err.response?.status === 401) {
            router.push("/login");
        }
      }
    };

    fetchQR();
  }, [router]);

  const enableMFA = async () => {
    try {
      const res = await axios.post("/api/mfa/enable", { code });
      alert(res.data.message);
      // Optional: Redirect to profile or dashboard
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to enable MFA");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading MFA Setup...</div>;

  return (
    <div className="grid place-items-center h-screen">
      <div className="p-4 text-center space-y-4 bg-gray-100 rounded-lg">
        <h1 className="text-2xl">Setup MFA</h1>
        {qr && <img src={`data:image/png;base64,${qr}`} alt="QR Code" />}

        <input
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border border-gray-300 p-2 rounded-l-md"
        />

        <button 
          onClick={enableMFA} 
          className="bg-green-400 border border-green-400 rounded-r-md p-2 hover:bg-green-500 transition"
        >
          Enable MFA
        </button>
      </div>
    </div>
  );
}