"use client";

import { useState } from "react";

export default function SubmitMusicPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">
        ← Back to Home
      </a>

      <h1 className="text-5xl font-black mt-10">
        Submit Music to MaBon Music LLC
      </h1>

      <p className="text-zinc-300 mt-4 max-w-2xl">
        Artists can submit music, lyrics, videos, press kits, and social links
        for professional review.
      </p>

      {submitted && (
        <div className="mt-6 rounded-xl border border-yellow-400/30 bg-green-950/40 p-4 text-green-300">
          Thank you. Your submission preview has been received. A real upload
          system will be connected before public launch.
        </div>
      )}

      <form
        className="mt-10 max-w-2xl space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <input className="w-full rounded-xl bg-zinc-900 p-4" placeholder="Artist Name" required />
        <input className="w-full rounded-xl bg-zinc-900 p-4" placeholder="Email Address" type="email" required />
        <input className="w-full rounded-xl bg-zinc-900 p-4" placeholder="Phone Number" />
        <input className="w-full rounded-xl bg-zinc-900 p-4" placeholder="Social Media Links" />
        <textarea className="w-full rounded-xl bg-zinc-900 p-4 h-32" placeholder="Tell MaBon Music LLC about your submission" />
        <input className="w-full rounded-xl bg-zinc-900 p-4" type="file" />

        <button
          type="submit"
          className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 px-6 py-3 rounded-full font-bold"
        >
          Submit for Review
        </button>
      </form>
    </main>
  );
}