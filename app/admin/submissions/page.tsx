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

export default function SubmissionsDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
async function listenToAudio(audioFilePath: string | null) {
  if (!audioFilePath) {
    alert("No audio file is attached to this submission.");
    return;
  }

  const { data, error } = await supabase.storage
    .from("artist-submissions")
    .createSignedUrl(audioFilePath, 3600);

  if (error || !data?.signedUrl) {
    alert(`Unable to open audio: ${error?.message || "Unknown error"}`);
    return;
  }

  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}
  async function loadSubmissions() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("artist_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSubmissions(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("artist_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Status update failed: " + error.message);
      return;
    }

    loadSubmissions();
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">← Back to Home</a>

      <h1 className="text-5xl font-black mt-10">
        MaBon Music Artist Development Dashboard
      </h1>

      <p className="text-zinc-300 mt-4 max-w-4xl leading-8">
        Review artist submissions, open music links, and update artist status.
      </p>

      {loading && (
        <p className="mt-10 text-yellow-400">Loading submissions...</p>
      )}

      {errorMessage && (
        <div className="mt-10 bg-red-950 border border-red-700 rounded-2xl p-5 text-red-200">
          <h2 className="text-xl font-bold">Dashboard Load Error</h2>
          <p className="mt-2">{errorMessage}</p>
        </div>
      )}

      {!loading && !errorMessage && submissions.length === 0 && (
        <div className="mt-10 bg-zinc-950 border border-yellow-500/20 rounded-2xl p-5 text-zinc-300">
          No submissions found.
        </div>
      )}

      <section className="mt-12 space-y-6">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-zinc-950 border border-red-900/40 rounded-3xl p-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">
                  {submission.artist_name || "Unknown Artist"}
                </h2>
                <p className="text-zinc-300 mt-1">
                  {submission.song_title || "Untitled Track"}
                </p>
                <p className="text-yellow-400 mt-2">
                  {submission.submission_goal || "Submission"}
                </p>
                <p className="text-zinc-400 mt-2">
                  {submission.artist_email}
                </p>
                <p className="text-zinc-400">{submission.phone_number}</p>
              </div>
<div className="mt-4">
  {submission.audio_file_path ? (
    <button
      type="button"
     onClick={() => listenToAudio(submission.audio_file_path!)}
      className="rounded-full bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 px-6 py-3 font-black text-black"
    >
      ▶ Play / Listen
    </button>
  ) : (
    <p className="text-sm text-zinc-500">
      No audio file attached
    </p>
  )}

  {submission.audio_file_name && (
    <p className="mt-2 text-sm text-zinc-400">
      File: {submission.audio_file_name}
    </p>
  )}
</div>
              <div className="text-right">
                <p className="text-zinc-400">Status</p>
                <p className="text-2xl font-black text-yellow-400">
                  {submission.status || "Submitted"}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-black border border-yellow-400/20 rounded-2xl p-5">
              <h3 className="text-xl font-bold">Artist Message</h3>
              <p className="text-zinc-300 mt-2">
                {submission.artist_message || "No message provided."}
              </p>
            </div>

            {submission.backup_link && (
              <a
                href={submission.backup_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-yellow-400 underline"
              >
                Open Music Link
              </a>
            )}

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => updateStatus(submission.id, "Approved")}
                className="bg-green-700 px-5 py-3 rounded-full font-bold"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(submission.id, "Revision Requested")}
                className="bg-yellow-600 px-5 py-3 rounded-full font-bold"
              >
                Request Revision
              </button>

              <button
                onClick={() =>
                  updateStatus(submission.id, "Development Candidate")
                }
                className="bg-blue-700 px-5 py-3 rounded-full font-bold"
              >
                Development Candidate
              </button>

              <button
                onClick={() => updateStatus(submission.id, "Not Ready Yet")}
                className="bg-red-800 px-5 py-3 rounded-full font-bold"
              >
                Not Ready Yet
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}