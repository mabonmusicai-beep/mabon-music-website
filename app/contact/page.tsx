export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">
        ← Back to Home
      </a>

      <h1 className="text-5xl font-black mt-10">
        MaBon AI Concierge
      </h1>

      <p className="text-zinc-300 mt-4 max-w-2xl">
        Contact MaBon Music LLC for business inquiries, artist submissions,
        partnerships, booking requests, licensing, support, and official communication.
      </p>

      <div className="mt-10 grid gap-6 max-w-2xl">
        <div className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">
            Business Inquiries
          </h2>

          <p className="text-zinc-400">
            Serious opportunities and verified business requests only.
          </p>
        </div>

        <div className="bg-zinc-900 border border-red-900/40 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">
            AI Concierge Support
          </h2>

          <p className="text-zinc-400">
            Automated support and inquiry screening powered by MaBon Music LLC.
          </p>
        </div>
      </div>
    </main>
  );
}