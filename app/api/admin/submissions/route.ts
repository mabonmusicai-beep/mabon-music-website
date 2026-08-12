import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;

const resend = new Resend(resendApiKey);

function isAuthorizedAdmin(request: NextRequest) {
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

function getStatusEmail(
  status: string,
  artistName: string,
  songTitle: string
) {
  const safeArtistName =
    artistName || "Artist";

  const safeSongTitle =
    songTitle || "your submission";

  if (status === "Approved") {
    return {
      subject:
        "MaBon Music Submission Approved",
      html: `
        <div style="font-family: Arial, sans-serif; background:#000000; color:#ffffff; padding:32px;">
          <div style="max-width:650px; margin:auto;">
            <h1 style="color:#facc15;">MaBon Music LLC</h1>

            <p>Hello ${safeArtistName},</p>

            <p>
              Thank you for submitting
              <strong>${safeSongTitle}</strong>
              to MaBon Music LLC.
            </p>

            <p>
              Your submission has been reviewed and its current status is:
            </p>

            <h2 style="color:#22c55e;">
              APPROVED
            </h2>

            <p>
              A member of the MaBon Music team may contact you regarding next steps.
            </p>

            <p>
              Thank you for allowing MaBon Music to review your work.
            </p>

            <p style="margin-top:30px;">
              MaBon Music LLC<br />
              Entertainment Platform
            </p>
          </div>
        </div>
      `,
    };
  }

  if (status === "Revision Requested") {
    return {
      subject:
        "MaBon Music Submission — Revision Requested",
      html: `
        <div style="font-family: Arial, sans-serif; background:#000000; color:#ffffff; padding:32px;">
          <div style="max-width:650px; margin:auto;">
            <h1 style="color:#facc15;">MaBon Music LLC</h1>

            <p>Hello ${safeArtistName},</p>

            <p>
              We reviewed
              <strong>${safeSongTitle}</strong>.
            </p>

            <p>
              Your current submission status is:
            </p>

            <h2 style="color:#f59e0b;">
              REVISION REQUESTED
            </h2>

            <p>
              MaBon Music is requesting additional revisions before making a final determination.
            </p>

            <p>
              Please keep an eye on your email for further instructions from the MaBon Music team.
            </p>

            <p style="margin-top:30px;">
              MaBon Music LLC<br />
              Entertainment Platform
            </p>
          </div>
        </div>
      `,
    };
  }

  if (status === "Development Candidate") {
    return {
      subject:
        "MaBon Music Development Candidate Status",
      html: `
        <div style="font-family: Arial, sans-serif; background:#000000; color:#ffffff; padding:32px;">
          <div style="max-width:650px; margin:auto;">
            <h1 style="color:#facc15;">MaBon Music LLC</h1>

            <p>Hello ${safeArtistName},</p>

            <p>
              Thank you for submitting
              <strong>${safeSongTitle}</strong>.
            </p>

            <p>
              Your submission has been placed in the following status:
            </p>

            <h2 style="color:#3b82f6;">
              DEVELOPMENT CANDIDATE
            </h2>

            <p>
              This means MaBon Music sees potential for further review, development, or possible future opportunities.
            </p>

            <p>
              This status is not a guarantee of a contract, release, payment, or representation.
            </p>

            <p>
              If MaBon Music decides to move forward, a member of the team may contact you directly.
            </p>

            <p style="margin-top:30px;">
              MaBon Music LLC<br />
              Entertainment Platform
            </p>
          </div>
        </div>
      `,
    };
  }

  if (status === "Not Ready Yet") {
    return {
      subject:
        "MaBon Music Submission Status Update",
      html: `
        <div style="font-family: Arial, sans-serif; background:#000000; color:#ffffff; padding:32px;">
          <div style="max-width:650px; margin:auto;">
            <h1 style="color:#facc15;">MaBon Music LLC</h1>

            <p>Hello ${safeArtistName},</p>

            <p>
              Thank you for allowing MaBon Music LLC to review
              <strong>${safeSongTitle}</strong>.
            </p>

            <p>
              Your current submission status is:
            </p>

            <h2 style="color:#ef4444;">
              NOT READY YET
            </h2>

            <p>
              After review, we are not moving this submission forward at this time.
            </p>

            <p>
              We appreciate your interest in MaBon Music and encourage continued development of your work.
            </p>

            <p style="margin-top:30px;">
              MaBon Music LLC<br />
              Entertainment Platform
            </p>
          </div>
        </div>
      `,
    };
  }

  return null;
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
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            "Server admin configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin =
      getAdminClient();

    const { data, error } =
      await supabaseAdmin
        .from("artist_submissions")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Admin submissions load failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load submissions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submissions: data || [],
    });
  } catch (error) {
    console.error(
      "Admin submissions API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected admin submissions error.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            "Server admin configuration is missing.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const id = Number(body?.id);

    const status = String(
      body?.status || ""
    ).trim();

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error:
            "Invalid submission ID.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Submitted",
      "Approved",
      "Revision Requested",
      "Development Candidate",
      "Not Ready Yet",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid submission status.",
        },
        { status: 400 }
      );
    }

    const supabaseAdmin =
      getAdminClient();

    const {
      data: existingSubmission,
      error: existingError,
    } = await supabaseAdmin
      .from("artist_submissions")
      .select(
        "id, artist_name, artist_email, song_title, status"
      )
      .eq("id", id)
      .single();

    if (
      existingError ||
      !existingSubmission
    ) {
      console.error(
        "Unable to find submission:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Submission could not be found.",
        },
        { status: 404 }
      );
    }

    const previousStatus =
      existingSubmission.status;

    const { data, error } =
      await supabaseAdmin
        .from("artist_submissions")
        .update({ status })
        .eq("id", id)
        .select(
          "id, artist_name, artist_email, song_title, status"
        )
        .single();

    if (error || !data) {
      console.error(
        "Admin submission update failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to update submission status.",
        },
        { status: 500 }
      );
    }

    let emailSent = false;
    let emailError: string | null = null;

    const statusChanged =
      previousStatus !== status;

    const emailTemplate =
      getStatusEmail(
        status,
        data.artist_name,
        data.song_title
      );

    if (
      statusChanged &&
      status !== "Submitted" &&
      data.artist_email &&
      emailTemplate
    ) {
      if (!resendApiKey) {
        emailError =
          "Resend API key is missing.";

        console.error(emailError);
      } else {
        const {
          data: emailData,
          error: resendError,
        } = await resend.emails.send({
          from:
            "MaBon Music LLC <submissions@updates.mabonmusicai.com>",
          to: [data.artist_email],
          subject:
            emailTemplate.subject,
          html:
            emailTemplate.html,
        });

        if (resendError) {
          emailError =
            resendError.message;

          console.error(
            "Status email failed:",
            resendError
          );
        } else {
          emailSent = true;

          console.log(
            "Status email sent:",
            emailData?.id
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      submission: data,
      emailSent,
      emailError,
      statusChanged,
    });
  } catch (error) {
    console.error(
      "Admin submission PATCH error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected submission update error.",
      },
      { status: 500 }
    );
  }
}