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
};

export default function SubmissionsDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSubmissions() {
    const { data, error } = await supabase
      .from("artist_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }

    setLoading(false);
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

  useEffect(() => {
    loadSubmissions();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">← Back to Home</a>

      <h1 className="text-5xl font-black mt-10">
        MaBon Music Artist Development Dashboard
      </h1>

      <p className="text-zinc-300 mt-4 max-w-3xl leading-8">
        Review artist submissions, score music, provide development feedback,
        request revisions, approve release candidates, and track artist growth.
      </p>

      {loading && <p className="mt-10 text-yellow-400">Loading submissions...</p>}

      <section className="mt-12 space-y-6">
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
                className="inline-block mt-5 text-yellow-400 underline"
              >
                Open Music Link
              </a>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
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