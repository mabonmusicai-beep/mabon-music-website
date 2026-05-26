export default function RyanCarterPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">
        ← Back to Home
      </a>

      <section className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-yellow-400 font-bold tracking-[0.25em] text-sm mb-3">
            MABON MUSIC LLC • EXECUTIVE ARTIST MANAGER • A&R REPRESENTATIVE • CREATIVE DEVELOPMENT EXECUTIVE
          </p>

          <h1 className="text-6xl font-black">
            Ryan Carter “Rah Rah”
          </h1>

          <div className="space-y-6 mt-8 text-zinc-300 leading-8">

            <p>
              Born and raised in East Oakland, California, Ryan Carter,
              professionally known as “Rah Rah,” developed a deep connection
              to music, culture, and artist development from an early age.
            </p>

            <p>
              As the youngest of six siblings, he was raised in a household
              where music was more than entertainment — it was a lifestyle,
              a form of expression, and a source of strength that helped shape
              his perspective, creativity, and understanding of people.
            </p>

            <p>
              Surrounded by diverse musical influences and real-life experiences
              within Oakland’s rich cultural landscape, Ryan cultivated an
              authentic appreciation for hip hop, R&B, and the evolving sound
              of modern independent music.
            </p>

            <p>
              With a natural ear for talent and an instinctive understanding
              of artist potential, Ryan has built his reputation as an
              Executive Artist Manager, A&R Representative, and Creative
              Development Executive through authenticity, communication,
              leadership, and long-term vision.
            </p>

            <p>
              His ability to recognize raw talent, understand artistic direction,
              and help shape creative development has made him an important
              asset within the MaBon Music LLC movement and its expanding
              roster of artists.
            </p>

            <p>
              Ryan specializes in artist relations, talent development,
              creative strategy, music production coordination, branding,
              release planning, and executive management across multiple genres,
              including hip hop, trap, drill, melodic rap, West Coast music,
              Bay Area rap, R&B, trap soul, and AI-assisted music production.
            </p>

            <p>
              His approach combines industry awareness with genuine artist
              support, allowing artists to maintain their individuality while
              developing marketable sound, branding, and long-term growth
              strategies.
            </p>

            <p>
              As Executive Artist Manager, A&R Representative, and Creative
              Development Executive for MaBon Music LLC, Ryan Carter helps
              oversee artist branding, production coordination, track
              development, release organization, executive communication,
              creative direction, and overall artist growth.
            </p>

            <p>
              His work contributes directly to the development and support
              of artists including Pondoe MaBon, LoLa Baggz, Chinatown Nae,
              Mortuary Luciano, Tantrum, Little D, Black, A.U.7.9.,
              O.T.G 3 Face, Isaiah The Prophet, Y.N.G.E. Bavvy,
              and additional developing talent associated with the
              MaBon Music LLC platform.
            </p>

            <p>
              In addition to artist management, Ryan contributes to production
              development and creative collaboration by helping organize
              concepts, coordinate musical direction, assist with song
              structure, and contribute to the overall sound and energy
              behind numerous MaBon Music LLC releases.
            </p>

            <p>
              His ability to bridge communication between artists, branding,
              production, and executive leadership makes him a vital part
              of the company’s creative infrastructure.
            </p>

            <p>
              Known for his professionalism, patience, leadership,
              and exceptional listening skills, Ryan understands that
              successful artist development extends beyond business alone.
            </p>

            <p>
              He believes in building meaningful relationships, fostering
              creativity, and creating environments where artists can grow
              both personally and professionally.
            </p>

            <p>
              Deeply connected to Oakland’s influence and driven by a lifelong
              passion for music, Ryan Carter continues playing a major role
              in helping expand the vision of MaBon Music LLC — a
              forward-thinking entertainment company rooted in innovation,
              authenticity, culture, opportunity, and the future of
              AI-assisted music and independent artist development.
            </p>

          </div>
        </div>

        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-950 via-black to-yellow-900 flex items-center justify-center text-5xl font-black text-yellow-400 text-center p-6">
            RAH RAH
            <br />
            RYAN CARTER
          </div>
        </div>
      </section>

      <section className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          "Executive Artist Manager",
          "A&R Representative",
          "Creative Development Executive",
          "Artist Relations",
          "Creative Strategy",
          "Production Coordination",
        ].map((role) => (
          <div
            key={role}
            className="rounded-2xl border border-yellow-400/30 bg-zinc-950 p-6"
          >
            <h2 className="text-2xl font-bold">{role}</h2>

            <p className="text-zinc-400 mt-2">
              MaBon Music LLC executive leadership role.
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}