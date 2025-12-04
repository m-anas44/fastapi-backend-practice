import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = process.env.API_BASE_URL;

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, data);
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error("Signup API error:", error.message);
    return NextResponse.json(
      { error: "Unexpected error occured while signing up" },
      { status: 500 }
    );
  }
}
