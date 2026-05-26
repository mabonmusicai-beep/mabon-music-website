export default function RyanCarterPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">
        ← Back to Home
      </a>

      <section className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-yellow-400 font-bold tracking-[0.25em] text-sm mb-3">
            MABON MUSIC LLC • EXECUTIVE ARTIST MANAGER • A&R
          </p>

          <h1 className="text-6xl font-black">
            Ryan Carter “Rah Rah”
          </h1>

          <p className="text-zinc-300 mt-6 leading-8">
            Born and raised in East Oakland, California, Ryan Carter,
            professionally known as “Rah Rah,” developed a deep connection
            to music, culture, and artist development from an early age.
            As the youngest of six siblings, he was raised in a household
            where music was more than entertainment — it was a lifestyle,
            a form of expression, and a source of strength that helped
            shape his perspective, creativity, and understanding of people.
          </p>

          <p className="text-zinc-300 mt-6 leading-8">
            With a natural ear for talent and an instinctive understanding
            of artist potential, Ryan has built his reputation as an
            Executive Artist Manager and A&R Representative through
            authenticity, communication, leadership, and vision.
          </p>

          <p className="text-zinc-300 mt-6 leading-8">
            As Executive Artist Manager and A&R Representative for MaBon
            Music LLC, Ryan Carter oversees and helps manage the creative
            development, branding, production coordination, and overall
            artist growth for the company’s expanding roster of talent.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-950 via-black to-yellow-900 flex items-center justify-center text-5xl font-black text-yellow-400 text-center p-6">
            RYAN CARTER
            <br />
            “RAH RAH”
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-4xl font-black mb-6">
          Managed Artists
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Pondoe MaBon",
            "LoLa Baggz",
            "Chinatown Nae",
            "Mortuary Luciano",
            "Tantrum",
            "Little D",
            "Black",
            "A.U.7.9",
            "O.T.G 3 Face",
            "Isaiah The Prophet",
            "Y.N.G.E. Bavvy",
          ].map((artist) => (
            <div
              key={artist}
              className="rounded-2xl border border-red-900/40 bg-zinc-950 p-5"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-black via-red-950 to-yellow-900 mb-4 flex items-center justify-center text-yellow-400 font-black text-center p-4">
                Artist Profile
              </div>

              <h3 className="font-bold text-lg">
                {artist}
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                Official MaBon Music LLC Artist
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black mb-3">
            Executive Leadership
          </h2>

          <p className="text-zinc-400 leading-7">
            Ryan Carter contributes to artist management,
            creative direction, release coordination,
            talent development, branding strategy,
            and production collaboration throughout
            the MaBon Music LLC platform.
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black mb-3">
            Genres & Development
          </h2>

          <p className="text-zinc-400 leading-7">
            Hip Hop • Trap • Drill • Bay Area Rap •
            West Coast Music • R&B • Trap Soul •
            AI-Assisted Music Production
          </p>
        </div>
      </section>
    </main>
  );
}