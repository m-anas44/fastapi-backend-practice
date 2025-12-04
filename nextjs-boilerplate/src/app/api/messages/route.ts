import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL = process.env.API_BASE_URL;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const room = url.searchParams.get("room") ?? "";

    if (!room) {
      return NextResponse.json({ error: "Room is required!" }, { status: 400 });
    }

    const res = await axios.get(`${BASE_URL}/api/v1/messages/${room}`);
    const data = res.data;

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
