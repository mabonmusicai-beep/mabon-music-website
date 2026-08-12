"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Submission = {
  id: number;
  artist_name: string;
  artist_email: string;
  phone_number: string;
  song_title: string;
  genre: string;
  submission_goal: string;
  backup_link: string;
  artist_message: string;
  submitted_lyrics: string | null;
  audio_file_path: string | null;
  audio_file_name: string | null;
  audio_file_type: string | null;
  status: string;
  created_at: string;
};

type VoteActivity = {
  id: number;
  contestant_id: number;
  vote_status: string;
  risk_score: number | null;
  risk_reason: string | null;
  suspicious: boolean | null;
  created_at: string;
};

export default function SubmissionsDashboardPage() {
  const [submissions, setSubmissions] =
    useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  // Voting Fraud Monitor state
  const [voteActivity, setVoteActivity] =
    useState<VoteActivity[]>([]);
  const [voteLoading, setVoteLoading] =
    useState(true);
  const [voteError, setVoteError] =
    useState("");

  async function logout() {
    try {
      const response = await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        alert(
          "Unable to log out. Please try again."
        );
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      alert(
        "Unable to log out. Please try again."
      );
    }
  }

  async function listenToAudio(
    audioFilePath: string | null
  ) {
    if (!audioFilePath) {
      alert(
        "No audio file is attached to this submission."
      );
      return;
    }

    const { data, error } =
      await supabase.storage
        .from("artist-submissions")
        .createSignedUrl(
          audioFilePath,
          3600
        );

    if (
      error ||
      !data?.signedUrl
    ) {
      alert(
        `Unable to open audio: ${
          error?.message ||
          "Unknown error"
        }`
      );
      return;
    }

    window.open(
      data.signedUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function loadSubmissions() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/admin/submissions",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.error ||
            "Unable to load submissions."
        );

        setSubmissions([]);
        return;
      }

      setSubmissions(
        result.submissions || []
      );
    } catch (error) {
      console.error(
        "Admin submissions request failed:",
        error
      );

      setErrorMessage(
        "Unable to load submissions."
      );

      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      const response = await fetch(
        "/api/admin/submissions",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Status update failed."
        );
        return;
      }

      await loadSubmissions();
    } catch (error) {
      console.error(
        "Status update request failed:",
        error
      );

      alert(
        "Status update failed. Please try again."
      );
    }
  }

  // Loads voting security records from our protected server endpoint.
  async function loadVoteActivity() {
    setVoteLoading(true);
    setVoteError("");

    try {
      const response = await fetch(
        "/api/admin/vote-activity",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setVoteError(
          result.error ||
            "Unable to load voting activity."
        );

        setVoteActivity([]);
        return;
      }

      setVoteActivity(
        result.activity || []
      );
    } catch (error) {
      console.error(
        "Vote activity request failed:",
        error
      );

      setVoteError(
        "Unable to load voting activity."
      );

      setVoteActivity([]);
    } finally {
      setVoteLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
    loadVoteActivity();
  }, []);

  const acceptedVotes =
    voteActivity.filter(
      (vote) =>
        vote.vote_status ===
        "accepted"
    ).length;

  const blockedAttempts =
    voteActivity.filter(
      (vote) =>
        vote.vote_status ===
        "cooldown_blocked"
    ).length;

  const flaggedVotes =
    voteActivity.filter(
      (vote) =>
        vote.suspicious === true
    ).length;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <a
          href="/"
          className="text-yellow-400 hover:underline"
        >
          ← Back to Home
        </a>

        <button
          type="button"
          onClick={logout}
          className="bg-red-700 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition"
        >
          Log Out
        </button>
      </div>

      <h1 className="text-5xl font-black mt-10">
        MaBon Music Artist Development
        Dashboard
      </h1>

      <p className="text-zinc-300 mt-4 max-w-4xl leading-8">
        Review artist submissions, open
        music links, and update artist
        status.
      </p>

      {loading && (
        <p className="mt-10 text-yellow-400">
          Loading submissions...
        </p>
      )}

      {errorMessage && (
        <div className="mt-10 bg-red-950 border border-red-700 rounded-2xl p-5 text-red-200">
          <h2 className="text-xl font-bold">
            Dashboard Load Error
          </h2>

          <p className="mt-2">
            {errorMessage}
          </p>
        </div>
      )}

      {!loading &&
        !errorMessage &&
        submissions.length === 0 && (
          <div className="mt-10 bg-zinc-950 border border-yellow-500/20 rounded-2xl p-5 text-zinc-300">
            No submissions found.
          </div>
        )}

      <section className="mt-12 space-y-6">
        {submissions.map(
          (submission) => (
            <div
              key={submission.id}
              className="bg-zinc-950 border border-red-900/40 rounded-3xl p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">
                    {submission.artist_name ||
                      "Unknown Artist"}
                  </h2>

                  <p className="text-zinc-300 mt-1">
                    {submission.song_title ||
                      "Untitled Track"}
                  </p>

                  <p className="text-yellow-400 mt-2">
                    {submission.submission_goal ||
                      "Submission"}
                  </p>

                  <p className="text-zinc-400 mt-2">
                    {
                      submission.artist_email
                    }
                  </p>

                  <p className="text-zinc-400">
                    {
                      submission.phone_number
                    }
                  </p>
                </div>
              </div>

              {submission.audio_file_name && (
                <div className="mt-6 bg-black border border-yellow-400/20 rounded-2xl p-5">
                  <p className="text-zinc-300">
                    File:{" "}
                    {
                      submission.audio_file_name
                    }
                  </p>

                  {submission.audio_file_path && (
                    <button
                      type="button"
                      onClick={() =>
                        listenToAudio(
                          submission.audio_file_path
                        )
                      }
                      className="mt-4 bg-yellow-400 text-black px-5 py-3 rounded-full font-bold"
                    >
                      Listen to Audio
                    </button>
                  )}
                </div>
              )}

              <div className="mt-6 bg-black border border-yellow-400/20 rounded-2xl p-5">
                <h3 className="text-xl font-bold">
                  Artist Message
                </h3>

                <p className="text-zinc-300 mt-2">
                  {submission.artist_message ||
                    "No message provided."}
                </p>
              </div>

              {submission.backup_link && (
                <a
                  href={
                    submission.backup_link
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 text-yellow-400 underline"
                >
                  Open Music Link
                </a>
              )}

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      submission.id,
                      "Approved"
                    )
                  }
                  className="bg-green-700 px-5 py-3 rounded-full font-bold"
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      submission.id,
                      "Revision Requested"
                    )
                  }
                  className="bg-yellow-600 px-5 py-3 rounded-full font-bold"
                >
                  Request Revision
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      submission.id,
                      "Development Candidate"
                    )
                  }
                  className="bg-blue-700 px-5 py-3 rounded-full font-bold"
                >
                  Development Candidate
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      submission.id,
                      "Not Ready Yet"
                    )
                  }
                  className="bg-red-800 px-5 py-3 rounded-full font-bold"
                >
                  Not Ready Yet
                </button>
              </div>
            </div>
          )
        )}
      </section>

      {/* VOTING FRAUD MONITOR */}
      <section className="mt-20 pt-12 border-t border-red-900/50">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5">
          <div>
            <p className="text-red-400 font-black uppercase tracking-[0.3em] text-sm">
              Security Monitoring
            </p>

            <h2 className="text-4xl font-black mt-3">
              Voting Fraud Monitor
            </h2>

            <p className="text-zinc-400 mt-3 max-w-3xl leading-7">
              Review accepted votes,
              blocked cooldown attempts,
              risk scores, and voting
              activity that may require
              administrative review.
            </p>
          </div>

          <button
            type="button"
            onClick={loadVoteActivity}
            className="border border-yellow-400/50 text-yellow-400 px-6 py-3 rounded-full font-bold"
          >
            Refresh Vote Activity
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-zinc-950 border border-green-500/30 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm uppercase">
              Accepted Votes
            </p>

            <p className="text-green-400 text-4xl font-black mt-2">
              {acceptedVotes}
            </p>
          </div>

          <div className="bg-zinc-950 border border-yellow-500/30 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm uppercase">
              Cooldown Blocks
            </p>

            <p className="text-yellow-400 text-4xl font-black mt-2">
              {blockedAttempts}
            </p>
          </div>

          <div className="bg-zinc-950 border border-red-500/30 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm uppercase">
              Flagged for Review
            </p>

            <p className="text-red-400 text-4xl font-black mt-2">
              {flaggedVotes}
            </p>
          </div>
        </div>

        {voteLoading && (
          <p className="text-yellow-400 mt-8">
            Loading vote activity...
          </p>
        )}

        {voteError && (
          <div className="mt-8 bg-red-950/40 border border-red-700 rounded-2xl p-5 text-red-200">
            <p className="font-bold">
              Voting Monitor Error
            </p>

            <p className="mt-2">
              {voteError}
            </p>
          </div>
        )}

        {!voteLoading &&
          !voteError &&
          voteActivity.length === 0 && (
            <div className="mt-8 bg-zinc-950 border border-yellow-500/20 rounded-2xl p-6 text-zinc-400">
              No voting activity found.
            </div>
          )}

        {!voteLoading &&
          !voteError &&
          voteActivity.length > 0 && (
            <div className="mt-8 space-y-4">
              {voteActivity.map(
                (vote) => (
                  <article
                    key={vote.id}
                    className={`rounded-2xl border p-5 ${
                      vote.suspicious
                        ? "border-red-500/60 bg-red-950/20"
                        : "border-zinc-800 bg-zinc-950"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <p className="text-xl font-black">
                          Contestant #
                          {
                            vote.contestant_id
                          }
                        </p>

                        <p className="text-zinc-400 text-sm mt-1">
                          {new Date(
                            vote.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <p
                          className={`font-black uppercase ${
                            vote.vote_status ===
                            "accepted"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {vote.vote_status.replaceAll(
                            "_",
                            " "
                          )}
                        </p>

                        <p className="text-zinc-400 mt-1">
                          Risk Score:{" "}
                          {vote.risk_score ??
                            0}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-5">
                      <div className="bg-black rounded-xl p-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase">
                          Risk Reason
                        </p>

                        <p className="text-zinc-300 mt-2">
                          {vote.risk_reason ||
                            "No risk flags"}
                        </p>
                      </div>

                      <div className="bg-black rounded-xl p-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase">
                          Administrative
                          Review
                        </p>

                        <p
                          className={`mt-2 font-bold ${
                            vote.suspicious
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {vote.suspicious
                            ? "YES — REVIEW"
                            : "No flag"}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </section>
    </main>
  );
}