import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

const BASE_URL = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("response from api: ", response.data)
    const nextResponse = NextResponse.json(response.data, { status: 201 });
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach((cookieStr) => {
        // We append the raw cookie string to the Next.js response headers
        nextResponse.headers.append('Set-Cookie', cookieStr);
      });
    }
    return nextResponse
  } catch (error: any) {
    console.error("Login Proxy Error:", error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
