import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://kzbfnkoasjuhgpsbdlok.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE_NAME = "wedding_comments";
const VALID_ATTENDANCE = new Set(["Hadir", "Berhalangan"]);

function getSupabaseHeaders() {
  if (!SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  };
}

function normalizeComment(row) {
  return {
    id: row.id,
    name: row.name,
    attendance: row.attendance,
    message: row.message,
    created_at: row.created_at
  };
}

function createConfigError() {
  return NextResponse.json(
    {
      error: "SUPABASE_ANON_KEY belum diisi. Tambahkan ke file .env.local terlebih dahulu."
    },
    { status: 500 }
  );
}

export async function GET() {
  const headers = getSupabaseHeaders();

  if (!headers) {
    return createConfigError();
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`);
  url.search = new URLSearchParams({
    select: "id,name,attendance,message,created_at",
    order: "created_at.desc"
  }).toString();

  const response = await fetch(url.toString(), {
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();

    return NextResponse.json(
      {
        error: "Gagal memuat komentar dari Supabase.",
        detail
      },
      { status: response.status }
    );
  }

  const rows = await response.json();

  return NextResponse.json({
    comments: rows.map(normalizeComment)
  });
}

export async function POST(request) {
  const headers = getSupabaseHeaders();

  if (!headers) {
    return createConfigError();
  }

  const body = await request.json();
  const name = body?.name?.trim();
  const attendance = body?.attendance?.trim();
  const message = body?.message?.trim();

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Nama wajib diisi dan maksimal 80 karakter." }, { status: 400 });
  }

  if (!VALID_ATTENDANCE.has(attendance)) {
    return NextResponse.json({ error: "Status kehadiran tidak valid." }, { status: 400 });
  }

  if (!message || message.length > 500) {
    return NextResponse.json({ error: "Ucapan wajib diisi dan maksimal 500 karakter." }, { status: 400 });
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=representation"
    },
    body: JSON.stringify([
      {
        name,
        attendance,
        message
      }
    ])
  });

  if (!response.ok) {
    const detail = await response.text();

    return NextResponse.json(
      {
        error: "Gagal menyimpan komentar ke Supabase.",
        detail
      },
      { status: response.status }
    );
  }

  const rows = await response.json();

  return NextResponse.json(
    {
      comment: normalizeComment(rows[0])
    },
    { status: 201 }
  );
}
