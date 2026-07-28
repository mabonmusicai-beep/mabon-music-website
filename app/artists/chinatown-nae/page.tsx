import Link from "next/link";

export default function ChinatownNaePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-black" />

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="absolute inset-4 rounded-3xl border border-yellow-500/30 sm:inset-8" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16 sm:px-10 lg:px-16">
        <header className="mb-14 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            MaBon Music LLC Entertainment Platform
          </p>

          <h1 className="text-4xl font-black uppercase tracking-wide text-white sm:text-6xl">
            Chinatown Nae
          </h1>

          <div className="mx-auto my-6 h-px max-w-xl bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-yellow-300">
            Official MaBon Music LLC Artist
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-yellow-500/50 bg-black/60 px-5 py-2 text-sm font-bold uppercase tracking-widest text-yellow-300 shadow-lg shadow-red-950/40">
            ✓ Verified Artist Profile
          </div>
        </header>

        <section className="mx-auto w-full max-w-4xl rounded-3xl border border-yellow-500/30 bg-black/70 p-7 shadow-2xl shadow-red-950/50 backdrop-blur-md sm:p-10">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-yellow-400">
            Official Biography
          </h2>

          <div className="space-y-6 leading-8 text-gray-200">
            <p>
              Ja&apos;Nae MaBon, professionally known as Chinatown Nae, is one
              of the youngest rising artists associated with MaBon Music LLC
              and represents a new generation of storytelling through music,
              resilience, and authenticity. Born and raised in Oakland,
              Chinatown Nae earned her nickname because of her distinctive
              features and unique appearance, which made her stand out from an
              early age. But beyond the nickname is a powerful story of
              perseverance, emotional strength, and determination far beyond
              her years.
            </p>

            <p>
              At just 13 years old, Chinatown Nae has already experienced
              realities that many children never have to face. Growing up with
              an incarcerated parent shaped much of her early life and
              emotional perspective. From childhood, visits with her father
              meant navigating prison security checkpoints, searches, strict
              institutional procedures, and the emotional weight that comes
              with seeing a loved one behind prison walls. Those experiences
              gave her firsthand understanding of the emotional impact
              incarceration can have on families and children.
            </p>

            <p>
              Rather than allowing those hardships to negatively define her
              future, Chinatown Nae transformed her experiences into
              motivation. She remained focused in school, maintained strong
              grades, participated in cheerleading, and developed a passion
              for music and creative expression. Inspired by her father&apos;s
              journey of self-education, entrepreneurship, and artistic
              development, she began building her own identity as an artist
              while learning the importance of responsibility, discipline,
              education, and positive decision-making from both of her
              parents.
            </p>

            <p>
              Her music is deeply personal and rooted in real-life
              experiences. Through emotionally honest storytelling, Chinatown
              Nae speaks about the challenges of growing up with an
              incarcerated parent, the emotional confusion children often
              carry in silence, and the determination to break cycles that
              affect many families and communities. Her music reflects
              maturity, vulnerability, strength, and hope while remaining
              age-appropriate and inspirational to other young people facing
              similar struggles.
            </p>

            <p>
              At only 13 years old, Chinatown Nae has already developed a
              studio-quality musical sound and continues gaining attention
              through her single,{" "}
              <span className="font-semibold text-white">
                Penitentiary Raised
              </span>
              , a heartfelt record that tells the story of coping with
              separation, emotional pain, and perseverance while still
              choosing positivity and growth. Her perspective is unique
              because she speaks not from imagination, but from lived
              experience.
            </p>

            <p>
              What makes Chinatown Nae especially promising is her mindset. She
              understands the consequences of poor decisions because she
              witnessed the effects firsthand within her own family. As she
              often expresses through her story, she does not have to
              &ldquo;touch the fire to know that it&apos;s hot.&rdquo; That
              awareness, combined with guidance from her parents and support
              from MaBon Music LLC, has helped shape her into a focused,
              intelligent, and ambitious young artist with enormous potential.
            </p>

            <p>
              As a member of MaBon Music LLC, Chinatown Nae represents more
              than music. She represents resilience, family, growth, and the
              possibility of creating a brighter future despite difficult
              beginnings. With charisma, authenticity, emotional depth, and
              natural star quality, she continues developing into a powerful
              young voice for her generation.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 grid w-full max-w-4xl gap-5 md:grid-cols-2">
          <ProfileSection
            title="Featured Single"
            text="Penitentiary Raised"
          />

          <ProfileSection
            title="Hometown"
            text="Oakland, California"
          />

          <ProfileSection
            title="Artist Focus"
            text="Authentic storytelling, resilience, family, growth, and youth empowerment."
          />

          <ProfileSection
            title="Official Updates"
            text="New releases, visuals, projects, interviews, and career milestones will be featured through MaBon Music LLC."
          />
        </section>

        <section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-red-700/40 bg-red-950/30 p-7 text-center sm:p-9">
          <h2 className="text-xl font-bold uppercase tracking-wider text-yellow-400">
            Follow Chinatown Nae&apos;s Journey
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-200">
            This official profile will continue to grow as Chinatown Nae
            releases new music, visuals, projects, and career updates through
            MaBon Music LLC.
          </p>
        </section>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/artists"
            className="rounded-xl border border-yellow-500 bg-yellow-500 px-7 py-3 text-center font-bold uppercase tracking-wide text-black transition hover:bg-yellow-400"
          >
            View Artist Roster
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-yellow-500/60 bg-black/70 px-7 py-3 text-center font-bold uppercase tracking-wide text-yellow-300 transition hover:bg-yellow-500 hover:text-black"
          >
            Return Home
          </Link>
        </div>

        <footer className="mt-16 border-t border-yellow-500/20 pt-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            MaBon Music LLC
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Authentic artistry. Creative ownership. Engineered Pressure.
          </p>
        </footer>
      </div>
    </main>
  );
}

function ProfileSection({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-yellow-500/20 bg-black/65 p-6 shadow-lg shadow-black/40 backdrop-blur-sm">
      <h2 className="text-lg font-bold uppercase tracking-wide text-yellow-400">
        {title}
      </h2>

      <div className="my-4 h-px bg-gradient-to-r from-red-700 via-yellow-500/60 to-transparent" />

      <p className="leading-7 text-gray-300">{text}</p>
    </article>
  );
}