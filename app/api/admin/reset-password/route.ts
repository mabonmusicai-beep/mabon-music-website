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
    const { token, password } = await request.json();

    const rawToken = String(token ?? "").trim();
    const newPassword = String(password ?? "");

    if (!rawToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 12) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must contain at least 12 characters.",
        },
        { status: 400 }
      );
    }

    if (
      !supabaseUrl ||
      !supabaseServiceKey
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password reset configuration is unavailable.",
        },
        { status: 500 }
      );
    }

    const tokenHash =
      createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const supabaseAdmin =
      getAdminClient();

    const {
      data: adminAccount,
      error: accountError,
    } = await supabaseAdmin
      .from("admin_auth")
      .select(
        "id, reset_token_hash, reset_token_expires_at"
      )
      .eq(
        "account_name",
        "mabon-admin"
      )
      .single();

    if (
      accountError ||
      !adminAccount
    ) {
      console.error(
        "Unable to load admin reset account:",
        accountError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or expired.",
        },
        { status: 400 }
      );
    }

    if (
      !adminAccount.reset_token_hash ||
      !adminAccount.reset_token_expires_at
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or expired.",
        },
        { status: 400 }
      );
    }

    const expiresAt =
      new Date(
        adminAccount.reset_token_expires_at
      ).getTime();

    if (
      Number.isNaN(expiresAt) ||
      Date.now() > expiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const providedTokenBuffer =
      Buffer.from(tokenHash, "utf8");

    const storedTokenBuffer =
      Buffer.from(
        adminAccount.reset_token_hash,
        "utf8"
      );

    const tokenMatches =
      providedTokenBuffer.length ===
        storedTokenBuffer.length &&
      timingSafeEqual(
        providedTokenBuffer,
        storedTokenBuffer
      );

    if (!tokenMatches) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or expired.",
        },
        { status: 400 }
      );
    }

    const newPasswordHash =
      createHash("sha256")
        .update(
          newPassword,
          "utf8"
        )
        .digest("hex");

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("admin_auth")
      .update({
        password_hash:
          newPasswordHash,

        reset_token_hash:
          null,

        reset_token_expires_at:
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "account_name",
        "mabon-admin"
      );

    if (updateError) {
      console.error(
        "Unable to save new admin password:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to update the staff password.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your MaBon Staff password has been changed successfully.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process the password reset.",
      },
      { status: 500 }
    );
  }
}