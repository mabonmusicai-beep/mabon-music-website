const submissions = [
  {
    artist: "Sample Artist",
    song: "Untitled Track",
    status: "Submitted",
    goal: "Artist Development Feedback",
    score: 78,
    notes: "Strong potential. Needs a stronger hook, cleaner mix, and more focused second verse.",
  },
  {
    artist: "Signed Artist Example",
    song: "Release Candidate",
    status: "Release Review",
    goal: "Release Review for Existing Artist",
    score: 86,
    notes: "Good direction. Needs final mix review before release approval.",
  },
];

export default function SubmissionsDashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">← Back to Home</a>

      <h1 className="text-5xl font-black mt-10">
        MaBon Music Artist Development Dashboard
      </h1>

      <p className="text-zinc-300 mt-4 max-w-3xl leading-8">
        Review artist submissions, score music, provide development feedback,
        request revisions, approve release candidates, and track artist growth
        through the MaBon Music LLC development process.
      </p>

      <section className="grid md:grid-cols-4 gap-4 mt-10">
        {["Submitted", "Under Review", "Development Feedback", "Release Candidate"].map((item) => (
          <div key={item} className="bg-zinc-950 border border-yellow-400/30 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-yellow-400">{item}</h2>
            <p className="text-zinc-400 mt-2">Submission status category</p>
          </div>
        ))}
      </section>

      <section className="mt-12 space-y-6">
        {submissions.map((submission) => (
          <div
            key={submission.song}
            className="bg-zinc-950 border border-red-900/40 rounded-3xl p-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">{submission.artist}</h2>
                <p className="text-zinc-300 mt-1">{submission.song}</p>
                <p className="text-yellow-400 mt-2">{submission.goal}</p>
              </div>

              <div className="text-right">
                <p className="text-zinc-400">Score</p>
                <p className="text-5xl font-black text-yellow-400">{submission.score}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-6">
              {["Lyrics", "Delivery", "Hook", "Mix Quality"].map((score) => (
                <div key={score} className="bg-black border border-yellow-400/20 rounded-xl p-4">
                  <p className="text-sm text-zinc-400">{score}</p>
                  <p className="text-2xl font-bold">Pending</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-black border border-yellow-400/20 rounded-2xl p-5">
              <h3 className="text-xl font-bold">Development Notes</h3>
              <p className="text-zinc-300 mt-2">{submission.notes}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button className="bg-green-700 px-5 py-3 rounded-full font-bold">Approve</button>
              <button className="bg-yellow-600 px-5 py-3 rounded-full font-bold">Request Revision</button>
              <button className="bg-blue-700 px-5 py-3 rounded-full font-bold">Development Candidate</button>
              <button className="bg-red-800 px-5 py-3 rounded-full font-bold">Not Ready Yet</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}