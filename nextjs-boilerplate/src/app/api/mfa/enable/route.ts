import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await axios.post(`${BASE_URL}/auth/mfa/enable`, body, {
      headers: {
        Cookie: `${token.name}=${token.value}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to enable MFA" },
      { status: error.response?.status || 500 }
    );
  }
}