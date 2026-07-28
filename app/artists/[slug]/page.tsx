import Link from "next/link";
import { notFound } from "next/navigation";

type ArtistProfile = {
  name: string;
  role: string;
};

const artistProfiles: Record<string, ArtistProfile> = {
  "mortuary-luciano": {
    name: "Mortuary Luciano",
    role: "Official MaBon Music LLC Artist",
  },

  tantrum: {
    name: "Tantrum",
    role: "Official MaBon Music LLC Artist",
  },

  "little-d": {
    name: "Little D",
    role: "Official MaBon Music LLC Artist",
  },

  black: {
    name: "Black",
    role: "Official MaBon Music LLC Artist",
  },

  "otg-3-face": {
    name: "OTG 3 Face",
    role: "Official MaBon Music LLC Artist",
  },

  "ynge-bavvy": {
    name: "Y.N.G.E. BAVVY",
    role: "Official MaBon Music LLC Artist",
  },

  "royalty-au79": {
    name: "Royalty A.U.7.9",
    role: "Official MaBon Music LLC Artist",
  },
};

type ArtistPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArtistPage({
  params,
}: ArtistPageProps) {
  const { slug } = await params;

  const normalizedSlug = slug.toLowerCase();
  const artist = artistProfiles[normalizedSlug];

  if (!artist) {
    notFound();
  }

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
            {artist.name}
          </h1>

          <div className="mx-auto my-6 h-px max-w-xl bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-yellow-300">
            {artist.role}
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-yellow-500/50 bg-black/60 px-5 py-2 text-sm font-bold uppercase tracking-widest text-yellow-300 shadow-lg shadow-red-950/40">
            ✓ Verified Artist Profile
          </div>
        </header>

        <section className="mx-auto w-full max-w-4xl rounded-3xl border border-yellow-500/30 bg-black/70 p-7 shadow-2xl shadow-red-950/50 backdrop-blur-md sm:p-10">
          <h2 className="mb-5 text-2xl font-bold uppercase tracking-wide text-yellow-400">
            Official Artist Profile
          </h2>

          <p className="leading-8 text-gray-200">
            This page serves as the official home for{" "}
            <strong className="text-white">{artist.name}</strong> within the
            MaBon Music LLC Entertainment Platform.
          </p>

          <p className="mt-5 leading-8 text-gray-200">
            Every artist represented by MaBon Music LLC has a unique story,
            creative vision, and musical journey. This official profile will
            feature verified artist information, music releases, media,
            projects, career milestones, and announcements connected to this
            artist&apos;s continued development.
          </p>

          <p className="mt-5 leading-8 text-gray-200">
            Whether you are discovering {artist.name} for the first time or
            following the artist&apos;s journey, this page will remain an
            official source for future releases, accomplishments, and updates
            from MaBon Music LLC.
          </p>
        </section>

        <section className="mx-auto mt-10 grid w-full max-w-4xl gap-5 md:grid-cols-2">
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

        <section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-red-700/40 bg-red-950/30 p-7 text-center sm:p-9">
          <h2 className="text-xl font-bold uppercase tracking-wider text-yellow-400">
            Follow the Journey
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-200">
            This profile will continue to evolve alongside{" "}
            <strong className="text-white">{artist.name}</strong> as new music,
            projects, visuals, and career accomplishments are officially
            released through MaBon Music LLC.
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