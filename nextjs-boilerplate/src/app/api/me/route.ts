import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Forward the cookie to FastAPI /auth/profile
    const res = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Cookie: `${token.name}=${token.value}`,
      },
      withCredentials: true,
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Not Authenticated" },
      { status: 401 } // Force 401 if FastAPI fails
    );
  }
}