export default function PondoePage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/artists" className="text-yellow-400">
        ← Back to Artists
      </a>

      <section className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-yellow-400 font-bold tracking-[0.25em] text-sm mb-3">
            MABON MUSIC LLC • FOUNDER • ARTIST
          </p>

          <h1 className="text-6xl font-black">
            Pondoe MaBon
          </h1>

          <p className="text-zinc-300 mt-5 leading-8">
            Pondoe MaBon, founder of MaBon Music LLC, is a visionary entrepreneur,
            lyricist, creative executive, and entertainment innovator whose story
            reflects resilience, transformation, discipline, and purpose. Born and
            raised in Oakland, California, Pondoe turned adversity into vision,
            education into opportunity, and pain into purpose.
          </p>

          <p className="text-zinc-300 mt-5 leading-8">
            After serving more than two decades of incarceration, Pondoe refused
            to allow his circumstances to destroy his mind, spirit, creativity, or
            future. Through self-education, discipline, business study, and faith,
            he founded MaBon Music LLC as a platform for overlooked writers,
            artists, and incarcerated talent with exceptional creative ability.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-950 via-black to-yellow-900 flex items-center justify-center text-6xl font-black text-yellow-400">
            PONDOE
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-4xl font-black mb-6">Discography</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "MaBon Music Presents LWOP: Life Without Pondoe Pt. 1",
            "MaBon Music Presents LWOP: Life Without Pondoe Pt. 2",
            "MaBon Music Presents LWOP: Life Without Pondoe Pt. 3",
            "MaBon Music Presents Pondoe: Standing on Business",
            "MaBon Music Presents Pondoe: Oakland Only Birthed One Legend",
            "MaBon Music Presents The Peacoat Banditz",
            "MaBon Music Presents 11 Deuce: Essence of a Scorpio",
          ].map((album) => (
            <div
              key={album}
              className="rounded-2xl border border-red-900/40 bg-zinc-950 p-5"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-black via-red-950 to-yellow-900 mb-4 flex items-center justify-center text-yellow-400 font-black text-center p-4">
                Album Cover Coming Soon
              </div>

              <h3 className="font-bold text-lg">{album}</h3>
              <p className="text-zinc-400 text-sm mt-2">
                Official MaBon Music LLC release.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black mb-3">Music Previews</h2>
          <p className="text-zinc-400">
            30-second audio previews will be added here once files are uploaded.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black mb-3">Visual Vault</h2>
          <p className="text-zinc-400">
            Official videos, trailers, interviews, and promotional visuals will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}