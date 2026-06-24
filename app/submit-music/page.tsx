"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SubmitMusicPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const submission = {
      artist_name: String(formData.get("artistName") || ""),
      artist_email: String(formData.get("email") || ""),
      phone_number: String(formData.get("phone") || ""),
      song_title: String(formData.get("songTitle") || ""),
      genre: String(formData.get("genre") || ""),
      submission_goal: String(formData.get("submissionGoal") || ""),
      backup_link: String(formData.get("musicLink") || ""),
      artist_message: String(formData.get("message") || ""),
      status: "Submitted",
      score: 0,
      development_notes: "",
    };

    const { error } = await supabase
      .from("artist_submissions")
      .insert([submission]);

    setLoading(false);

    if (error) {
      alert("Submission failed. Please try again or email mabonmusicai@gmail.com.");
      console.error(error);
      return;
    }

    setSubmitted(true);
    form.reset();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">← Back to Home</a>

      <h1 className="text-5xl font-black mt-10">
        Submit Music to MaBon Music LLC
      </h1>

      <p className="text-zinc-300 mt-4 max-w-3xl leading-8">
        New and existing artists may submit MP3 or WAV music files for professional review by MaBon Music LLC.
        Submissions are reviewed through the MaBon Music Artist Development process. Not every submission
        will be approved for release immediately, but artists may receive constructive feedback,
        development notes, revision suggestions, or an invitation to resubmit improved material.
      </p>

      {submitted && (
        <div className="mt-6 rounded-xl border border-green-400/40 bg-green-950/40 p-4 text-green-300 max-w-3xl">
          Submission received. MaBon Music LLC will review your material through the Artist Development process.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-5">
        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="artistName" placeholder="Artist Name" required />
        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="email" type="email" placeholder="Artist Email" required />
        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="phone" placeholder="Phone Number" />

        <select className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="artistStatus" required>
          <option value="">Select Artist Status</option>
          <option>New Artist Seeking Review</option>
          <option>Signed MaBon Music LLC Artist</option>
          <option>Producer / Songwriter Submission</option>
        </select>

        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="songTitle" placeholder="Song Title" required />
        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="genre" placeholder="Genre" required />

        <select className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="submissionGoal" required>
          <option value="">What are you submitting for?</option>
          <option>Label Signing Consideration</option>
          <option>Release Review for Existing Artist</option>
          <option>Artist Development Feedback</option>
          <option>Feature / Collaboration Consideration</option>
          <option>Songwriter / Producer Review</option>
        </select>

        <label className="block text-yellow-400 font-bold">
          Upload MP3 or WAV File
        </label>

        <input
          className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30"
          name="musicFile"
          type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
        />

        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="musicLink" placeholder="Backup Music Link: Google Drive, Dropbox, SoundCloud, etc." />

        <textarea
          className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30 min-h-40"
          name="message"
          placeholder="Tell us about the song, project, artist, release goal, and what type of feedback or review you are requesting."
        />

        <button
          disabled={loading}
          className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 px-8 py-4 rounded-full font-black disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Music for Review"}
        </button>
      </form>
    </main>
  );
}