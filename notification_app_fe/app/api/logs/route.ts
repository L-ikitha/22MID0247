import { NextRequest, NextResponse } from "next/server";

const BASE = "http://4.224.186.213/evaluation-service";
const TOKEN = process.env.EVAL_TOKEN || process.env.NEXT_PUBLIC_EVAL_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BASE}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "upstream failed" },
      { status: 502 }
    );
  }
}