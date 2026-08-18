import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const muxTokenId = process.env.MUX_TOKEN_ID;
const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

function getMuxClient() {
  if (!muxTokenId || !muxTokenSecret) {
    throw new Error("Mux API credentials are missing.");
  }

  return new Mux({
    tokenId: muxTokenId,
    tokenSecret: muxTokenSecret,
  });
}

function getAllowedCorsOrigin(request: Request) {
  const requestOrigin = request.headers.get("origin") || "";

  const allowedOrigins = new Set([
    "http://localhost:3000",
    "https://mabonmusicai.com",
    "https://www.mabonmusicai.com",
  ]);

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    return requestOrigin;
  }

  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const submissionReference = String(
      body?.submissionReference ?? ""
    ).trim();

    const mux = getMuxClient();

    const upload = await mux.video.uploads.create({
      cors_origin: getAllowedCorsOrigin(request),

      new_asset_settings: {
        playback_policies: ["signed"],
        video_quality: "basic",
        passthrough:
          submissionReference || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      uploadUrl: upload.url,
    });
  } catch (error) {
    console.error(
      "Mux direct upload creation failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to prepare the secure video upload.",
      },
      {
        status: 500,
      }
    );
  }
}