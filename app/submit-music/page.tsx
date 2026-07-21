"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitMusicPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  const form = e.currentTarget;
  const formData = new FormData(form);

  const audioFile = formData.get("audio_file") as File | null;

  const submittedLyrics = String(
    formData.get("submitted_lyrics") || ""
  ).trim();

  const hasAudio = Boolean(audioFile && audioFile.size > 0);
  const hasLyrics = submittedLyrics.length > 0;

  if (!hasAudio && !hasLyrics) {
    setMessage(
      "Please upload an audio file, enter written lyrics, or provide both."
    );
    setLoading(false);
    return;
  }

  let audioFilePath = "";
  let audioFileName = "";
  let audioFileType = "";

  if (audioFile && audioFile.size > 0) {
    audioFileName = audioFile.name;
    audioFileType = audioFile.type;

    const safeName = audioFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    audioFilePath = `${Date.now()}-${safeName}`;

    const uploadResult = await supabase.storage
      .from("artist-submissions")
      .upload(audioFilePath, audioFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: audioFile.type,
      });

    if (uploadResult.error) {
      setMessage(`Audio upload failed: ${uploadResult.error.message}`);
      setLoading(false);
      return;
    }
  }

  const { error } = await supabase.from("artist_submissions").insert({
    artist_name: formData.get("artist_name"),
    artist_email: formData.get("artist_email"),
    phone_number: formData.get("phone_number"),
    song_title: formData.get("song_title"),
    genre: formData.get("genre"),
    submission_goal: formData.get("submission_goal"),
    backup_link: formData.get("backup_link"),
    artist_message: formData.get("message"),
    submitted_lyrics: submittedLyrics,
    audio_file_path: audioFilePath || null,
    audio_file_name: audioFileName || null,
    audio_file_type: audioFileType || null,
    status: "Submitted",
  });

  if (error) {
    setMessage(`Submission failed: ${error.message}`);
  } else {
    setMessage(
      hasAudio && hasLyrics
        ? "Submission received. Audio and written lyrics were uploaded successfully."
        : hasAudio
          ? "Submission received. Audio file uploaded successfully."
          : "Submission received. Written lyrics submitted successfully."
    );

    form.reset();
  }

  setLoading(false);
}

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-8 py-10">
      <a href="/" className="text-yellow-400">← Back to Home</a>

      <h1 className="text-5xl font-black mt-10 mb-6">
        Submit Music to MaBon Music LLC
      </h1>

      <p className="max-w-4xl text-zinc-200 mb-8">
        New and existing artists may submit MP3 or WAV music files for professional review by MaBon Music LLC.
      </p>

      {message && (
        <div className="mb-6 rounded border border-green-500/60 bg-green-950/40 p-4 text-green-300">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
        <input name="artist_name" required placeholder="Artist Name" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" />
        <input name="artist_email" required type="email" placeholder="Artist Email" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" />
        <input name="phone_number" placeholder="Phone Number" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" />

        <select name="artist_status" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30">
          <option value="">Select Artist Status</option>
          <option>New Artist</option>
          <option>Existing Artist</option>
          <option>Signed Artist</option>
          <option>Producer / Songwriter</option>
        </select>

        <input name="song_title" required placeholder="Song Title" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" />
        <input name="genre" placeholder="Genre" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" />

        <select name="submission_goal" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30">
          <option value="">Select Submission Goal</option>
          <option>Artist Development Feedback</option>
          <option>Label Signing Consideration</option>
          <option>Songwriter / Producer Review</option>
          <option>Release Candidate</option>
        </select>

        <input name="backup_link" placeholder="Backup Music Link / YouTube / SoundCloud" className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" />

        <input
          name="audio_file"
          type="file"
          
          accept="audio/mpeg,audio/wav,audio/x-wav,audio/flac,audio/mp4,audio/aac,audio/ogg"
          className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30"
        />
<div>
  <label className="block mb-2 text-yellow-400 font-bold">
    Submit Written Lyrics
  </label>

  <p className="mb-3 text-sm text-zinc-400">
    No audio file available? Type or paste the complete lyrics below.
    Artists may also submit both lyrics and audio.
  </p>

  <textarea
    name="submitted_lyrics"
    spellCheck={true}
lang="en"
    placeholder={`Paste the complete lyrics here.

[Intro]
[Verse 1]
[Chorus]
[Verse 2]
[Bridge]
[Outro]`}
    className="min-h-80 w-full rounded border border-yellow-400/30 bg-zinc-900 p-4 font-mono text-white"
  />
</div>
        <textarea name="message" placeholder="Tell us about the song." className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30 min-h-40" />

        <button disabled={loading} className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 px-8 py-4 rounded-full font-black text-black disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Music for Review"}
        </button>
      </form>
    </main>
  );
}