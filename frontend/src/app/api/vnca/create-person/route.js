import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin.from("PERSONS").insert([body]).select();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ person: data[0] }, { status: 200 });
}