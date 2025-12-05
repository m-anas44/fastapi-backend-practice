"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function SetupMFA() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQrUri = async () => {
      try {
        const res = await axios.get("/api/mfa/setup");
        const uri = res.data.data.uri;
        const qrcode = await QRCode.toDataURL(uri);
        setQr(qrcode);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching QR URI", err);
        if (err.response?.status === 401) {
          router.push("/login");
        }
      }
    };

    fetchQrUri();
  }, [router]);

  const enableMFA = async () => {
    try {
      const res = await axios.post("/api/mfa/enable", { code });
      alert(res.data.message);
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to enable MFA");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading MFA Setup...</div>;

  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="p-8 flex flex-col items-center space-y-4 bg-white shadow-lg rounded-xl max-w-sm w-full">
        <h1 className="text-2xl font-bold">Setup MFA</h1>
        <div className="w-44 h-44 bg-gray-50 grid place-items-center">
          {qr ? <img src={qr} alt="QR Code" /> : <p>No QR yet</p>}
        </div>
        <div>
          <input
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-gray-300 p-2 rounded-l-md focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={enableMFA}
            className="bg-blue-600 text-white p-2 rounded-r-md border border-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Enable MFA
          </button>
        </div>
      </div>
    </div>
  );
}
