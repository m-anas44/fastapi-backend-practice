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
    <form className="grid place-items-center h-screen">
      <div className="max-w-md p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={handleSignup}
          className="w-full p-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          Sign Up
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </div>
    </form>
  );
};

export default SignupForm;
