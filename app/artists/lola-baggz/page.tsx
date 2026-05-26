export default function LolaBaggzPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/artists" className="text-yellow-400">
        ← Back to Artists
      </a>

      <section className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-yellow-400 font-bold tracking-[0.25em] text-sm mb-3">
            MABON MUSIC LLC • CO-FOUNDER • EXECUTIVE PRODUCER • ARTIST MANAGER • A&R
          </p>

          <h1 className="text-6xl font-black">
            Jennifer MaBon “LoLa Baggz”
          </h1>

          <div className="space-y-6 mt-8 text-zinc-300 leading-8">

            <p>
              Jennifer MaBon, professionally known as “LoLa Baggz,” is an entrepreneur,
              executive creative partner, and one of the driving forces behind the
              development and day-to-day operations of MaBon Music LLC.
            </p>

            <p>
              Born and raised in East Oakland, California, Jennifer represents
              resilience, intelligence, loyalty, creativity, faith, and unwavering
              dedication to family, business, and long-term vision.
            </p>

            <p>
              Raised in a structured and spiritually grounded household, Jennifer grew
              up surrounded by strong family values, discipline, respect, communication,
              and perseverance. The example established by her parents — whose marriage
              endured for more than 35 years — helped shape the foundation of her own
              beliefs surrounding loyalty, commitment, family unity, and unconditional
              support.
            </p>

            <p>
              A proud graduate of Oakland Technical High School and California State
              University, Fresno, Jennifer balanced education, motherhood, business
              development, and personal responsibility while navigating life
              circumstances that demanded extraordinary emotional strength and
              resilience.
            </p>

            <p>
              Long before the creation of MaBon Music LLC, Jennifer and Pondoe MaBon
              were high school sweethearts whose relationship survived decades of
              separation caused by incarceration.
            </p>

            <p>
              Today, Jennifer MaBon serves as Co-Founder, Executive Producer,
              Artist Manager, A&R Representative, Operations Director,
              and Financial Coordinator for MaBon Music LLC.
            </p>

            <p>
              Jennifer has played a direct role in helping develop, organize,
              produce, and coordinate every major MaBon Music LLC project released
              to date. Her contributions extend across music releases, artist branding,
              production concepts, visual presentations, digital distribution
              preparation, merchandising concepts, website development,
              and overall platform execution.
            </p>

            <p>
              Known for her professionalism, intelligence, discipline,
              and exceptional work ethic, Jennifer approaches business with both
              creativity and precision.
            </p>

            <p>
              Jennifer MaBon represents the strength of a powerful Black woman
              whose grace, intellect, loyalty, and determination helped transform
              pain into purpose and vision into reality.
            </p>

          </div>
        </div>

        <div className="rounded-3xl border border-yellow-400/30 bg-zinc-950 p-6">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-red-950 via-black to-yellow-900 flex items-center justify-center text-5xl font-black text-yellow-400 text-center p-6">
            LOLA BAGGZ
            <br />
            JENNIFER MABON
          </div>
        </div>
      </section>

      <section className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          "Co-Founder",
          "Executive Producer",
          "Artist Manager",
          "A&R Representative",
          "Operations Director",
          "Financial Coordinator",
        ].map((role) => (
          <div
            key={role}
            className="rounded-2xl border border-yellow-400/30 bg-zinc-950 p-6"
          >
            <h2 className="text-2xl font-bold">{role}</h2>

            <p className="text-zinc-400 mt-2">
              MaBon Music LLC leadership role.
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}