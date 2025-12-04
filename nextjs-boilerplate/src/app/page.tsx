"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { getMessages } from "@/handlers/messagesHandler";
import { socket } from "@/socket/socketClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  
  // Auth & UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Chat States
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [userName, setUserName] = useState("");

  // 1. AUTH CHECK ON MOUNT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call our Next.js Proxy
        const res = await axios.get("/api/me");
        
        // If successful, set user data
        setIsAuthenticated(true);
        setCurrentUser(res.data.data); // Adjust based on your ApiResponse structure
        setUserName(res.data.data.name); // Auto-fill username from profile
        setIsMfaEnabled(res.data.data.mfa_enabled);
        
      } catch (error) {
        // If 401 or fail, redirect to login
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // 2. SOCKET SETUP (Only runs if joined)
  useEffect(() => {
    if (!joined) return;

    const fetchAllMessages = async () => {
      const prev = await getMessages(room);
      setMessages(prev);
    };
    fetchAllMessages();

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) =>
      setMessages((prev) => [...prev, { sender: "system", message }])
    );

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, [joined, room]);

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
  };

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join_room", { room, username: userName });
      setJoined(true);
    }
  };

  const handleMfaNavigation = () => {
    if (isMfaEnabled) {
      // Optional: Add logic here to disable MFA (requires an API call)
      alert("MFA is currently enabled."); 
    } else {
      // Redirect to Setup page
      router.push("/mfa/setup");
    }
  }

  // Show loading spinner while checking cookies
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not authenticated (and useEffect hasn't redirected yet), return null
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative">
      
      {/* --- TOP RIGHT MFA INDICATOR --- */}
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-bold text-gray-700">{currentUser?.email}</span>
          <div 
            onClick={handleMfaNavigation}
            className={`cursor-pointer flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
              isMfaEnabled 
                ? "bg-green-100 text-green-700 border-green-300" 
                : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isMfaEnabled ? "bg-green-500" : "bg-gray-400"}`}></div>
            {isMfaEnabled ? "MFA Enabled" : "Enable MFA"}
          </div>
        </div>
      </div>

      {!joined ? (
        <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          {/* User Name input is pre-filled but editable */}
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 border-gray-200 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 border-gray-200 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 border-gray-300 rounded-lg">
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}