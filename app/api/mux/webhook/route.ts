import Mux from "@mux/mux-node";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const muxWebhookSecret =
  process.env.MUX_WEBHOOK_SECRET;

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Supabase webhook configuration is missing."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

function getMuxWebhookClient() {
  if (!muxWebhookSecret) {
    throw new Error(
      "Mux webhook configuration is missing."
    );
  }

  return new Mux({
    webhookSecret: muxWebhookSecret,
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    let event;

    try {
      const mux =
        getMuxWebhookClient();

      event = await mux.webhooks.unwrap(
        rawBody,
        request.headers
      );
    } catch (error) {
      console.error(
        "Mux webhook signature verification failed:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid webhook signature.",
        },
        {
          status: 401,
        }
      );
    }

    const supabaseAdmin =
      getSupabaseAdmin();

    if (
      event.type ===
      "video.upload.asset_created"
    ) {
      const uploadId =
        event.data.id;

      const assetId =
        event.data.asset_id;

      if (!uploadId || !assetId) {
        return NextResponse.json({
          success: true,
          ignored: true,
        });
      }

      const {
        error: uploadUpdateError,
      } = await supabaseAdmin
        .from("artist_submissions")
        .update({
          mux_upload_id: uploadId,
          mux_asset_id: assetId,
          mux_status: "processing",
        })
        .eq(
          "video_file_path",
          `mux-upload:${uploadId}`
        );

      if (uploadUpdateError) {
        console.error(
          "Unable to connect Mux upload to submission:",
          uploadUpdateError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to connect the uploaded video to the submission.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        event:
          "video.upload.asset_created",
      });
    }

    if (
      event.type ===
      "video.asset.ready"
    ) {
      const assetId =
        event.data.id;

      const duration =
        typeof event.data.duration ===
        "number"
          ? event.data.duration
          : null;

      const playbackIds =
        event.data.playback_ids || [];

      const playbackId =
        playbackIds.length > 0
          ? playbackIds[0]?.id || null
          : null;

      if (!assetId) {
        return NextResponse.json({
          success: true,
          ignored: true,
        });
      }

      const {
        error: readyUpdateError,
      } = await supabaseAdmin
        .from("artist_submissions")
        .update({
          mux_asset_id: assetId,
          mux_playback_id: playbackId,
          mux_status: "ready",
          mux_duration_seconds: duration,
        })
        .eq(
          "mux_asset_id",
          assetId
        );

      if (readyUpdateError) {
        console.error(
          "Unable to update ready Mux asset:",
          readyUpdateError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to save the processed video information.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        event:
          "video.asset.ready",
      });
    }

    if (
      event.type ===
      "video.asset.errored"
    ) {
      const assetId =
        event.data.id;

      if (assetId) {
        const {
          error: errorUpdateError,
        } = await supabaseAdmin
          .from("artist_submissions")
          .update({
            mux_status: "errored",
          })
          .eq(
            "mux_asset_id",
            assetId
          );

        if (errorUpdateError) {
          console.error(
            "Unable to record Mux asset error:",
            errorUpdateError
          );
        }
      }

      return NextResponse.json({
        success: true,
        event:
          "video.asset.errored",
      });
    }

    return NextResponse.json({
      success: true,
      ignored: true,
      event: event.type,
    });
  } catch (error) {
    console.error(
      "Mux webhook route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process the Mux webhook.",
      },
      {
        status: 500,
      }
    );
  }
}