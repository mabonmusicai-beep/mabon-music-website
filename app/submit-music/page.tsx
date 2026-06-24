"use client";

export default function SubmitMusicPage() {
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
  Our goal is to help serious artists grow, refine their sound, and align with the creative
  direction of MaBon Music LLC.
</p>
      <form
        action="https://formsubmit.co/mabonmusicai@gmail.com"
        method="POST"
        encType="multipart/form-data"
        className="mt-10 max-w-3xl space-y-5"
      >
        <input type="hidden" name="_subject" value="New Music Submission - MaBon Music LLC" />
        <input type="hidden" name="_captcha" value="false" />

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
<select
  className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30"
  name="submissionGoal"
  required
>
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
          required
        />

        <input className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30" name="musicLink" placeholder="Backup Music Link: Google Drive, Dropbox, SoundCloud, etc." />

        <textarea className="w-full p-4 rounded bg-zinc-900 border border-yellow-400/30 min-h-40" name="message" placeholder="Tell us about the song, project, artist, or release request." />

        <button className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 px-8 py-4 rounded-full font-black">
          Submit Music for Review
        </button>
      </form>
    </main>
  );
}