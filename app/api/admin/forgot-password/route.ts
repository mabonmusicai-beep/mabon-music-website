import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

const resendApiKey =
  process.env.RESEND_API_KEY!;

const resend = new Resend(resendApiKey);

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
    const { email } = await request.json();

    const enteredEmail =
      String(email ?? "")
        .trim()
        .toLowerCase();

    if (
      !supabaseUrl ||
      !supabaseServiceKey ||
      !resendApiKey
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password recovery configuration is unavailable.",
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
        "id, recovery_email"
      )
      .eq(
        "account_name",
        "mabon-admin"
      )
      .single();

    if (
      error ||
      !adminAccount
    ) {
      console.error(
        "Unable to load admin recovery account:",
        error
      );

      return NextResponse.json(
        {
          success: true,
          message:
            "If that email matches the authorized recovery account, a reset link will be sent.",
        }
      );
    }

    const storedRecoveryEmail =
      String(
        adminAccount.recovery_email ??
          ""
      )
        .trim()
        .toLowerCase();

    if (
      !enteredEmail ||
      enteredEmail !==
        storedRecoveryEmail
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If that email matches the authorized recovery account, a reset link will be sent.",
        }
      );
    }

    const rawToken =
      randomBytes(32).toString("hex");

    const tokenHash =
      createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiresAt =
      new Date(
        Date.now() +
          20 * 60 * 1000
      ).toISOString();

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("admin_auth")
      .update({
        reset_token_hash:
          tokenHash,
        reset_token_expires_at:
          expiresAt,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "account_name",
        "mabon-admin"
      );

    if (updateError) {
      console.error(
        "Unable to save password reset token:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to create password reset request.",
        },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${baseUrl}/admin/reset-password?token=${rawToken}`;

    const {
      error: emailError,
    } = await resend.emails.send({
      from:
        "MaBon Music LLC <submissions@updates.mabonmusicai.com>",
      to: [
        adminAccount.recovery_email,
      ],
      subject:
        "MaBon Staff Password Reset",
      html: `
        <div style="font-family:Arial,sans-serif;background:#000;color:#fff;padding:32px;">
          <div style="max-width:650px;margin:auto;">
            <h1 style="color:#facc15;">
              MaBon Music LLC
            </h1>

            <p>
              A password reset was requested for the MaBon Staff Login.
            </p>

            <p>
              This reset link expires in 20 minutes.
            </p>

            <p style="margin:30px 0;">
              <a
                href="${resetUrl}"
                style="background:#facc15;color:#000;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold;"
              >
                Reset Staff Password
              </a>
            </p>

            <p>
              If you did not request this reset, you can ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error(
        "Password reset email failed:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send password reset email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If that email matches the authorized recovery account, a reset link will be sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process password recovery.",
      },
      { status: 500 }
    );
  }
}