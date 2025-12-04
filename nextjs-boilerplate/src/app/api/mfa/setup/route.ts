import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    console.log("token: ", token)
    if (!token) {
      return NextResponse.json(
        { message: "Not Authenticated" },
        { status: 401 }
      );
    }

    const res = await axios.get(`${BASE_URL}/auth/mfa/setup`, {
      headers: {
        Cookie: `${token.name}=${token.value}`, 
      },
      withCredentials: true
    });

    return NextResponse.json(res.data);
    
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to fetch MFA setup";
    
    return NextResponse.json({ message }, { status });
  }
}