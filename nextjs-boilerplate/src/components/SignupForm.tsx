"use client";
import { signupHandler } from "@/handlers/authHandler";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter()

  const handleSignup = async (e: any) => {
    e.preventDefault();
    try {
      const response = await signupHandler({ name, email, password, phone });

      router.push("/login")
      setName("");
      setEmail("");
      setPassword("");
      setPhone("")
    } catch (err: any) {
      console.log("Error in signing up", err);
      setMessage("Signup failed");
    } finally {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };
  return (
    <form className="grid place-items-center h-screen bg-gray-50">
      <div className="p-8 text-center space-y-3 bg-white shadow-lg rounded-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
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
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Sign Up
        </button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default SignupForm;
