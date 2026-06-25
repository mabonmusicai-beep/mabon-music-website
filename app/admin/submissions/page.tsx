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
  status: string;
  score: number;
  development_notes: string;
  created_at: string;
  lyrics_score: number;
  delivery_score: number;
  hook_score: number;
  mix_quality_score: number;
  originality_score: number;
  commercial_score: number;
  brand_score: number;
  mman_score: number;
  mman_report: string;
};

export default function SubmissionsDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState("");
  async function loadSubmissions() {
    const { data, error } = await supabase
      .from("artist_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
  setErrorMessage(error.message);
  console.error("Supabase load error:", error);
} else if (data) {
  setSubmissions(data);
}

setLoading(false);
  }

  function calculateMMAN(submission: Submission) {
    const total =
      Number(submission.lyrics_score || 0) +
      Number(submission.delivery_score || 0) +
      Number(submission.hook_score || 0) +
      Number(submission.mix_quality_score || 0) +
      Number(submission.originality_score || 0) +
      Number(submission.commercial_score || 0) +
      Number(submission.brand_score || 0);

    return Math.round(total / 7);
  }

  async function updateField(id: number, field: keyof Submission, value: string | number) {
    const { error } = await supabase
      .from("artist_submissions")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      alert("Update failed.");
      return;
    }

    loadSubmissions();
  }

  async function saveMMAN(submission: Submission) {
    const mmanScore = calculateMMAN(submission);

    const { error } = await supabase
      .from("artist_submissions")
      .update({
        lyrics_score: submission.lyrics_score || 0,
        delivery_score: submission.delivery_score || 0,
        hook_score: submission.hook_score || 0,
        mix_quality_score: submission.mix_quality_score || 0,
        originality_score: submission.originality_score || 0,
        commercial_score: submission.commercial_score || 0,
        brand_score: submission.brand_score || 0,
        mman_score: mmanScore,
        mman_report: submission.mman_report || "",
      })
      .eq("id", submission.id);

    if (error) {
      alert("MMAN save failed.");
      return;
    }

    alert("MMAN analysis saved.");
    loadSubmissions();
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("artist_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Status update failed.");
      return;
    }

    loadSubmissions();
  }

  function localUpdate(id: number, field: keyof Submission, value: string | number) {
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === id ? { ...submission, [field]: value } : submission
      )
    );
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
        Review artist submissions, score music through the MMAN system, provide
        development feedback, request revisions, approve release candidates, and
        track artist growth.
      </p>

      {loading && <p className="mt-10 text-yellow-400">Loading submissions...</p>}
{errorMessage && (
  <div className="mt-10 bg-red-950 border border-red-700 rounded-2xl p-5 text-red-200">
    <h2 className="text-xl font-bold">Dashboard Load Error</h2>
    <p className="mt-2">{errorMessage}</p>
  </div>
)}

{!loading && !errorMessage && submissions.length === 0 && (
  <div className="mt-10 bg-zinc-950 border border-yellow-500/20 rounded-2xl p-5 text-zinc-300">
    No submissions found. Check Supabase data and environment variables.
  </div>
)}
      <section className="mt-12 space-y-8">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-zinc-950 border border-red-900/40 rounded-3xl p-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">{submission.artist_name}</h2>
                <p className="text-zinc-300 mt-1">{submission.song_title}</p>
                <p className="text-yellow-400 mt-2">{submission.submission_goal}</p>
                <p className="text-zinc-400 mt-2">{submission.artist_email}</p>
                <p className="text-zinc-400">{submission.phone_number}</p>
              </div>

              <div className="text-right">
                <p className="text-zinc-400">Status</p>
                <p className="text-2xl font-black text-yellow-400">
                  {submission.status || "Submitted"}
                </p>

                <p className="text-zinc-400 mt-5">MMAN Score</p>
                <p className="text-5xl font-black text-yellow-400">
                  {submission.mman_score || calculateMMAN(submission)}
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

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {[
                ["lyrics_score", "Lyrics"],
                ["delivery_score", "Delivery"],
                ["hook_score", "Hook"],
                ["mix_quality_score", "Mix Quality"],
                ["originality_score", "Originality"],
                ["commercial_score", "Commercial"],
                ["brand_score", "Brand"],
              ].map(([field, label]) => (
                <div
                  key={field}
                  className="bg-black border border-yellow-400/20 rounded-2xl p-4"
                >
                  <label className="text-zinc-300 block mb-2">{label}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={Number(submission[field as keyof Submission] || 0)}
                    onChange={(e) =>
                      localUpdate(
                        submission.id,
                        field as keyof Submission,
                        Number(e.target.value)
                      )
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-xl font-bold block mb-3">
                MMAN Development Report
              </label>
              <textarea
                value={submission.mman_report || ""}
                onChange={(e) =>
                  localUpdate(submission.id, "mman_report", e.target.value)
                }
                placeholder="Write MaBon Music MMAN analysis, strengths, weaknesses, revision notes, and recommendation..."
                className="w-full min-h-40 bg-black border border-yellow-400/20 rounded-2xl p-5 text-white"
              />
            </div>

            <button
              onClick={() => saveMMAN(submission)}
              className="mt-5 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-black"
            >
              Save MMAN Analysis
            </button>

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
                onClick={() => updateStatus(submission.id, "Development Candidate")}
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