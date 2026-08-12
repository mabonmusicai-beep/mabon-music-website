import { createHash, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const enteredPassword =
      String(password ?? "");

    const sessionToken =
      process.env.ADMIN_SESSION_TOKEN ?? "";

    if (
      !supabaseUrl ||
      !supabaseServiceKey
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin database configuration is missing.",
        },
        { status: 500 }
      );
    }

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin session configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin =
      getAdminClient();

    const {
      data: adminAccount,
      error,
    } = await supabaseAdmin
      .from("admin_auth")
      .select(
        "password_hash"
      )
      .eq(
        "account_name",
        "mabon-admin"
      )
      .single();

    if (
      error ||
      !adminAccount?.password_hash
    ) {
      console.error(
        "Unable to load admin account:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Admin account configuration is unavailable.",
        },
        { status: 500 }
      );
    }

    const enteredHash =
      createHash("sha256")
        .update(
          enteredPassword,
          "utf8"
        )
        .digest("hex");

    const enteredBuffer =
      Buffer.from(
        enteredHash,
        "utf8"
      );

    const storedBuffer =
      Buffer.from(
        adminAccount.password_hash,
        "utf8"
      );

    const passwordsMatch =
      enteredBuffer.length ===
        storedBuffer.length &&
      timingSafeEqual(
        enteredBuffer,
        storedBuffer
      );

    if (!passwordsMatch) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Incorrect password.",
        },
        { status: 401 }
      );
    }

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      "mabon_admin",
      sessionToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process admin login.",
      },
      { status: 500 }
    );
  }
}