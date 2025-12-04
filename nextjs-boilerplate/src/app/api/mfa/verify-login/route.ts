import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. GET THE TEMP COOKIE (mfa_token) FROM BROWSER
    const cookieStore = await cookies();
    const mfaToken = cookieStore.get("mfa_token");

    if (!mfaToken) {
      return NextResponse.json({ message: "Session expired" }, { status: 401 });
    }

    // 2. FORWARD IT TO FASTAPI
    const res = await axios.post(`${BASE_URL}/auth/mfa/verify-login`, body, {
      headers: {
        Cookie: `${mfaToken.name}=${mfaToken.value}`, // Pass the mfa_token
      },
      withCredentials: true,
    });

    // 3. CREATE NEXT.JS RESPONSE
    const nextResponse = NextResponse.json(res.data);

    // 4. CAPTURE THE NEW COOKIE (access_token) FROM FASTAPI
    // FastAPI sends 'Set-Cookie'. We must pass this header to the browser.
    const setCookieHeader = res.headers['set-cookie'];

    if (setCookieHeader) {
      setCookieHeader.forEach((cookieStr) => {
        nextResponse.headers.append('Set-Cookie', cookieStr);
      });
    }

    return nextResponse;

  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "MFA verification failed";
    return NextResponse.json({ message }, { status });
  }
}