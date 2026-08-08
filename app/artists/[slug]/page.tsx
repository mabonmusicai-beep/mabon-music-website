import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ArtistProfile = {
  name: string;
  role: string;
  portrait: string;
  portraitAlt: string;
};

const artistProfiles: Record<string, ArtistProfile> = {
  "mortuary-luciano": {
    name: "Mortuary Luciano",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/mortuary-luciano-silhouette.png",
    portraitAlt:
      "Mortuary Luciano adult male artist silhouette at a live concert",
  },

  tantrum: {
    name: "Tantrum",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/tantrum-silhouette.png",
    portraitAlt:
      "Tantrum adult male artist silhouette performing before a concert audience",
  },

  "little-d": {
    name: "Little D",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/little-d-silhouette.png",
    portraitAlt:
      "Little D adult male artist silhouette standing under concert lights",
  },

  black: {
    name: "Black",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/black-silhouette.png",
    portraitAlt:
      "Black adult male artist silhouette performing on a concert stage",
  },

  "otg-3-face": {
    name: "OTG 3 Face",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/otg-3-face-silhouette.png",
    portraitAlt:
      "OTG 3 Face adult male artist silhouette facing a concert audience",
  },

  "ynge-bavvy": {
    name: "Y.N.G.E. BAVVY",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/ynge-bavvy-silhouette.png",
    portraitAlt:
      "Y.N.G.E. Bavvy adult male artist silhouette performing beneath stage lights",
  },

  "royalty-au79": {
    name: "Royalty A.U.7.9",
    role: "Official MaBon Music LLC Artist",
    portrait: "/images/placeholders/royalty-au79-silhouette.png",
    portraitAlt:
      "Royalty A.U.7.9 adult male artist silhouette performing for a concert crowd",
  },
};

type ArtistPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;

  const normalizedSlug = slug.toLowerCase();
  const artist = artistProfiles[normalizedSlug];

  if (!artist) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* MaBon Music background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-black" />

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="absolute inset-4 rounded-3xl border border-yellow-500/30 sm:inset-8" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-14 sm:px-10 lg:px-16">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/artists"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400 transition hover:text-yellow-300"
          >
            ← Back to Artists
          </Link>
        </div>

        {/* Artist introduction */}
        <section className="grid items-stretch gap-10 lg:grid-cols-2">
          {/* Left side */}
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
              MaBon Music LLC • Official Artist
            </p>

            <h1 className="text-5xl font-black uppercase leading-tight tracking-wide text-white sm:text-6xl">
              {artist.name}
            </h1>

            <div className="my-6 h-px w-full max-w-xl bg-gradient-to-r from-yellow-400 via-red-700 to-transparent" />

            <p className="text-lg font-semibold uppercase tracking-[0.2em] text-yellow-300">
              {artist.role}
            </p>

            <div className="mt-6 inline-flex w-fit items-center rounded-full border border-yellow-500/50 bg-black/60 px-5 py-2 text-sm font-bold uppercase tracking-widest text-yellow-300">
              ✓ Verified Artist Profile
            </div>

            <div className="mt-9 space-y-6 leading-8 text-gray-200">
              <p>
                This page serves as the official home for{" "}
                <strong className="text-white">{artist.name}</strong> within the
                MaBon Music LLC Entertainment Platform.
              </p>

              <p>
                Every artist represented by MaBon Music LLC has a unique story,
                creative vision, and musical journey. This official profile
                will feature verified artist information, music releases,
                media, projects, career milestones, and announcements
                connected to the artist&apos;s continued development.
              </p>

              <p>
  Whether you are discovering{" "}
  <strong>{artist.name}</strong>{" "}
  for the first time or following the artist&apos;s journey, this page
  will remain an official source for future releases,
  accomplishments, and updates from MaBon Music LLC.
</p>
            </div>
          </div>

          {/* Right side — one unique image for this artist */}
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-yellow-500/40 bg-black/80 p-5 shadow-2xl shadow-red-950/60">
            <div className="absolute inset-5 overflow-hidden rounded-3xl bg-black">
              <Image
                src={artist.portrait}
                alt={artist.portraitAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />

              {/* Dark lower fade for readable artist name */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />

              <div className="absolute inset-x-0 bottom-8 px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-400">
                  MaBon Music Artist Session
                </p>

                <p className="mt-3 text-3xl font-black uppercase tracking-wide text-white">
                  {artist.name}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* These six cards remain text-only */}
        <section className="mx-auto mt-16 grid w-full max-w-6xl gap-6 md:grid-cols-2">
          <ProfileSection
            title="Artist Information"
            text="Official artist profile and career information will be featured here as new releases, projects, and milestones are added to the MaBon Music LLC catalog."
          />

          <ProfileSection
            title="Discography"
            text="Official music releases, albums, singles, featured appearances, and catalog information will be presented here."
          />

          <ProfileSection
            title="Official Visuals"
            text="Music videos, promotional visuals, interviews, and additional official media will be featured here."
          />

          <ProfileSection
            title="Photos and Media"
            text="Professional photography, promotional media, and approved artist content will be presented through this official profile."
          />

          <ProfileSection
            title="Career Highlights"
            text="Projects, collaborations, performances, achievements, and important career milestones will be documented here."
          />

          <ProfileSection
            title="Latest Updates"
            text="Official MaBon Music LLC announcements, artist news, release information, and upcoming projects will be published here."
          />
        </section>

        {/* Follow the journey */}
        <section className="mx-auto mt-12 w-full max-w-6xl rounded-3xl border border-red-700/50 bg-red-950/35 p-8 text-center shadow-xl shadow-black/30 sm:p-10">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-yellow-400">
            Follow the Journey
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-gray-200">
            This profile will continue to evolve alongside{" "}
            <strong className="text-white">{artist.name}</strong> as new music,
            projects, visuals, and career accomplishments are officially
            released through MaBon Music LLC.
          </p>
        </section>

        {/* Navigation */}
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/artists"
            className="rounded-xl border border-yellow-500 bg-yellow-500 px-8 py-4 text-center font-bold uppercase tracking-wide text-black transition hover:bg-yellow-400"
          >
            View Artist Roster
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-yellow-500/60 bg-black/70 px-8 py-4 text-center font-bold uppercase tracking-wide text-yellow-300 transition hover:bg-yellow-500 hover:text-black"
          >
            Return Home
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-yellow-500/20 pt-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
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
    <article className="rounded-2xl border border-yellow-500/25 bg-black/70 p-7 shadow-lg shadow-black/40 backdrop-blur-sm">
      <h2 className="text-xl font-bold uppercase tracking-wide text-yellow-400">
        {title}
      </h2>

      <div className="my-5 h-px bg-gradient-to-r from-red-700 via-yellow-500/60 to-transparent" />

      <p className="leading-8 text-gray-300">{text}</p>
    </article>
  );
}