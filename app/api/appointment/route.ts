import { NextResponse } from "next/server";

/**
 * Stub booking endpoint. Stores nothing; this demo is static-first by
 * design. It validates the payload shape and returns a reference code so
 * the form can demonstrate accessible success and error states end to end.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be JSON." },
      { status: 400 },
    );
  }

  const required = ["name", "phone", "service", "location", "timeWindow"];
  const missing = required.filter(
    (k) => typeof body[k] !== "string" || (body[k] as string).trim() === "",
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const reference = `NG-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  return NextResponse.json({ ok: true, reference });
}
