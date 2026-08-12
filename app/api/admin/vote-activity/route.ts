import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

function isAuthorizedAdmin(
  request: NextRequest
) {
  const sessionToken =
    request.cookies.get("mabon_admin")?.value;

  const expectedToken =
    process.env.ADMIN_SESSION_TOKEN;

  return Boolean(
    expectedToken &&
      sessionToken &&
      sessionToken === expectedToken
  );
}

function getAdminClient() {
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export async function GET(
  request: NextRequest
) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  try {
    if (
      !supabaseUrl ||
      !supabaseServiceKey
    ) {
      return NextResponse.json(
        {
          error:
            "Server voting monitor configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin =
      getAdminClient();

    const { data, error } =
      await supabaseAdmin
        .from("vote_activity")
        .select(
          "id, contestant_id, vote_status, risk_score, risk_reason, suspicious, created_at"
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(100);

    if (error) {
      console.error(
        "Vote activity admin load failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load voting activity.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      activity: data || [],
    });
  } catch (error) {
    console.error(
      "Vote activity API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected voting monitor error.",
      },
      { status: 500 }
    );
  }
}