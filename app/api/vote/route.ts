import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

function hashValue(value: string) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function getClientIp(request: NextRequest) {
  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getRequestFingerprint(
  request: NextRequest,
  userAgent: string
) {
  const language =
    request.headers.get("accept-language") || "";

  const platform =
    request.headers.get("sec-ch-ua-platform") || "";

  const browser =
    request.headers.get("sec-ch-ua") || "";

  return hashValue(
    `${userAgent}|${language}|${platform}|${browser}`
  );
}

function looksAutomated(userAgent: string) {
  const value = userAgent.toLowerCase();

  const botTerms = [
    "bot",
    "crawler",
    "spider",
    "headless",
    "selenium",
    "playwright",
    "puppeteer",
    "curl",
    "wget",
    "python-requests",
    "postmanruntime",
  ];

  return botTerms.some((term) =>
    value.includes(term)
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            "Server voting configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const body = await request.json();

    const contestantId = Number(
      body?.contestantId
    );

    const voterId = String(
      body?.voterId || ""
    ).trim();

    if (
      !Number.isInteger(contestantId) ||
      contestantId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid contestant.",
        },
        { status: 400 }
      );
    }

    if (!voterId) {
      return NextResponse.json(
        {
          error:
            "Voter identification is missing.",
        },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);

    const userAgent =
      request.headers.get("user-agent") ||
      "unknown";

    const voterKey = hashValue(
      `${voterId}:${ip}`
    );

    const ipHash = hashValue(ip);

    const requestFingerprint =
      getRequestFingerprint(
        request,
        userAgent
      );

    /*
     * FRAUD MONITORING
     *
     * These checks create a risk score only.
     * They do NOT automatically reject a legitimate vote.
     */

    let riskScore = 0;
    const riskReasons: string[] = [];

    if (
      userAgent === "unknown" ||
      looksAutomated(userAgent)
    ) {
      riskScore += 40;
      riskReasons.push(
        "automated_or_unusual_user_agent"
      );
    }

    const tenMinutesAgo = new Date(
      Date.now() - 10 * 60 * 1000
    ).toISOString();

    const fiveMinutesAgo = new Date(
      Date.now() - 5 * 60 * 1000
    ).toISOString();

    /*
     * Count recent accepted votes from the same
     * network. This is intentionally a high threshold
     * because families, schools, workplaces, etc.
     * may share one public IP.
     */
    const {
      count: recentIpVotes,
      error: ipCountError,
    } = await supabaseAdmin
      .from("vote_activity")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("ip_hash", ipHash)
      .eq("vote_status", "accepted")
      .gte("created_at", tenMinutesAgo);

    if (ipCountError) {
      console.error(
        "IP monitoring lookup failed:",
        ipCountError
      );
    } else if (
      (recentIpVotes || 0) >= 25
    ) {
      riskScore += 30;
      riskReasons.push(
        "high_network_vote_volume"
      );
    }

    /*
     * Count recent votes with a matching browser/device
     * fingerprint.
     */
    const {
      count: recentFingerprintVotes,
      error: fingerprintCountError,
    } = await supabaseAdmin
      .from("vote_activity")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "request_fingerprint",
        requestFingerprint
      )
      .eq("vote_status", "accepted")
      .gte("created_at", tenMinutesAgo);

    if (fingerprintCountError) {
      console.error(
        "Fingerprint monitoring lookup failed:",
        fingerprintCountError
      );
    } else if (
      (recentFingerprintVotes || 0) >= 10
    ) {
      riskScore += 35;
      riskReasons.push(
        "high_device_vote_volume"
      );
    }

    /*
     * Look for repeated blocked attempts during the
     * cooldown period.
     */
    const {
      count: recentBlockedAttempts,
      error: blockedCountError,
    } = await supabaseAdmin
      .from("vote_activity")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("voter_key", voterKey)
      .eq(
        "vote_status",
        "cooldown_blocked"
      )
      .gte("created_at", fiveMinutesAgo);

    if (blockedCountError) {
      console.error(
        "Blocked-attempt monitoring failed:",
        blockedCountError
      );
    } else if (
      (recentBlockedAttempts || 0) >= 5
    ) {
      riskScore += 25;
      riskReasons.push(
        "repeated_rapid_vote_attempts"
      );
    }

    const { data, error } =
      await supabaseAdmin.rpc(
        "cast_dance_vote",
        {
          p_contestant_id: contestantId,
          p_voter_key: voterKey,
          p_ip_hash: ipHash,
          p_user_agent: userAgent,
        }
      );

    if (error) {
      console.error(
        "Protected vote failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Your vote could not be processed.",
        },
        { status: 500 }
      );
    }

    const result = Array.isArray(data)
      ? data[0]
      : data;

    if (!result) {
      return NextResponse.json(
        {
          error:
            "No voting result was returned.",
        },
        { status: 500 }
      );
    }

    /*
     * The database rejected this vote because
     * the 30-minute cooldown is still active.
     */
    if (!result.success) {
      if (result.message === "cooldown") {
        const minutesRemaining =
          result.minutes_remaining || 1;

        const repeatedRapidAttempts =
          (recentBlockedAttempts || 0) >= 5;

        await supabaseAdmin
          .from("vote_activity")
          .insert({
            contestant_id: contestantId,
            voter_key: voterKey,
            ip_hash: ipHash,
            user_agent: userAgent,
            vote_status:
              "cooldown_blocked",
            request_fingerprint:
              requestFingerprint,
            risk_score:
              repeatedRapidAttempts
                ? Math.max(
                    riskScore,
                    25
                  )
                : riskScore,
            risk_reason:
              repeatedRapidAttempts
                ? [
                    ...riskReasons,
                    "cooldown_attempt",
                  ].join(",")
                : "cooldown_attempt",
            suspicious:
              repeatedRapidAttempts ||
              riskScore >= 50,
          });

        return NextResponse.json(
          {
            error: "cooldown",
            minutesRemaining,
            message: `You can vote for this contestant again in ${minutesRemaining} minute${
              minutesRemaining === 1
                ? ""
                : "s"
            }.`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error:
            result.message ||
            "Contestant is not available for voting.",
        },
        { status: 400 }
      );
    }

    /*
     * The protected database function has already
     * created the accepted vote_activity record.
     *
     * Find that newest record and attach the
     * fraud-monitoring information.
     */
    const {
      data: acceptedVote,
      error: acceptedVoteLookupError,
    } = await supabaseAdmin
      .from("vote_activity")
      .select("id")
      .eq(
        "contestant_id",
        contestantId
      )
      .eq("voter_key", voterKey)
      .eq("vote_status", "accepted")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (acceptedVoteLookupError) {
      console.error(
        "Accepted vote monitoring lookup failed:",
        acceptedVoteLookupError
      );
    }

    if (acceptedVote?.id) {
      const suspicious =
        riskScore >= 50;

      const {
        error: monitoringUpdateError,
      } = await supabaseAdmin
        .from("vote_activity")
        .update({
          request_fingerprint:
            requestFingerprint,
          risk_score: riskScore,
          risk_reason:
            riskReasons.length > 0
              ? riskReasons.join(",")
              : null,
          suspicious,
        })
        .eq("id", acceptedVote.id);

      if (monitoringUpdateError) {
        console.error(
          "Fraud monitoring update failed:",
          monitoringUpdateError
        );
      }
    }

    return NextResponse.json({
      success: true,
      voteCount: result.vote_count,
      cooldownMinutes: 30,
      message:
        "Vote counted successfully.",
    });
  } catch (error) {
    console.error(
      "Vote API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected voting error.",
      },
      { status: 500 }
    );
  }
}