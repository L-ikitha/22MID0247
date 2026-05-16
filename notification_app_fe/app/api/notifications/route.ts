import { NextRequest, NextResponse } from "next/server";

const BASE = "http://4.224.186.213/evaluation-service";
const TOKEN = process.env.EVAL_TOKEN || process.env.NEXT_PUBLIC_EVAL_TOKEN || "";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const qs = url.searchParams.toString();
  const target = `${BASE}/notifications${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(target, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "upstream failed" },
      { status: 502 }
    );
  }
}