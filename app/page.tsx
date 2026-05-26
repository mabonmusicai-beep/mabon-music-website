"use client";

import { useState } from "react";

const artists = [
  {
    name: "Pondoe MaBon",
    tag: "Founder / AI Artist",
    img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "LoLa Baggz",
    tag: "Artist / Executive Producer",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Chinatown Nae",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mortuary Luciano",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Tantrum",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Little D",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Black",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "A.U.7.9",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "O.T.G 3 Face",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Isaiah The Prophet",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Y.N.G.E Bavvy",
    tag: "Official MaBon Music LLC Artist",
    img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
  },
];

const rows = [
  "MaBon Featured Roster",
  "Pressure Releases",
  "Visual Vault",
  "Collector Drops",
];

export default function Home() {
  const [artistOpen, setArtistOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black via-black/80 to-transparent px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-black text-yellow-400">
          MaBon Music AI.com
        </div>
<nav className="hidden md:flex gap-5 text-sm text-zinc-200">
  <a href="/">Home</a>
  <a href="/artists">Artists</a>
  <a href="/music">Music</a>
  <a href="/videos">Videos</a>
  <a href="/merch">Merch</a>
  <a href="/submit-music">Submit Music</a>
</nav>

        <button
          onClick={() => setArtistOpen(!artistOpen)}
          className="bg-red-950/40 border border-yellow-400/30 px-4 py-2 rounded-full"
        >
          Artists ▾
        </button>

        {artistOpen && (
          <div className="absolute right-6 top-16 bg-zinc-950 border border-yellow-400/30 rounded-2xl w-64 overflow-hidden">
            {artists.map((artist) => (
              <a
  key={artist.name}
  href={artist.name === "Pondoe" ? "/artists/pondoe" : "/artists"}
  className="block px-4 py-3 border-b border-white/10 hover:bg-red-700/30"
>
  <p className="font-bold">{artist.name}</p>
  <p className="text-xs text-zinc-400">
    Open official artist page
  </p>
</a>
            ))}
          </div>
        )}
      </header>

      <section className="relative min-h-[84vh] flex items-end px-6 pb-20 overflow-hidden border-b border-yellow-400/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-[9rem] md:text-[15rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500/30 via-yellow-300/40 to-white/10 rotate-[-8deg]">
            مابون
          </div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <p className="text-yellow-400 font-bold tracking-[0.35em] text-sm mb-4">
            MABON MUSIC LLC • ENGINEERED PRESSURE
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Mabon Music LLC Entertainment Platform
          </h1>

          <p className="text-lg md:text-xl text-zinc-200 mb-8 max-w-2xl">
            Explore Mabon Music LLC artists, preview music, watch visuals, buy
            exclusive releases, submit content for review, and experience the
            official Mabon Music LLC entertainment platform.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
  href="/music"
  className="bg-white text-black px-6 py-3 rounded-full font-bold"
>
  ▶ Play 30-Second Preview
</a>
              
  <a
  href="/merch"
  className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 px-6 py-3 rounded-full font-bold"
>
  Shop MaBon Exclusives
</a>
            <a
  href="/submit-music"
  className="bg-red-950/50 border border-yellow-400/30 px-6 py-3 rounded-full font-bold"
>
  Submit Music
</a>
 <a
  href="/contact"
  className="bg-black/60 border border-yellow-400/30 px-6 py-3 rounded-full font-bold"
>
  Ask AI Concierge
  
</a>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 space-y-14">
        <div className="grid md:grid-cols-4 gap-4 -mt-10 relative z-20">
          {[
            ["✨", "Official Brand Hub", "MaBon Music LLC artists, releases, visuals, and exclusive drops in one place."],
            ["🎧", "Music Previews", "Controlled 30-second listening clips for fans and buyers."],
            ["💿", "CDs & Collectors", "Physical albums, limited editions, and branded merchandise."],
            ["📡", "Artist Discovery", "Dedicated artist pages with bios, catalogs, visuals, and accolades."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="rounded-3xl bg-zinc-950 border border-red-900/40 p-6"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-black text-lg mb-2">{title}</h3>
              <p className="text-sm text-zinc-400">{text}</p>
            </div>
          ))}
        </div>

        {rows.map((row) => (
          <section key={row}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black">{row}</h2>
              <button className="text-sm text-zinc-400 hover:text-yellow-300">
                View All
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3">
              {artists.map((artist) => (
                <a
  key={`${row}-${artist.name}`}
  href={artist.name === "Pondoe" ? "/artists/pondoe" : "/artists"}
  className="min-w-[240px] h-[150px] rounded-2xl overflow-hidden relative border border-red-900/40"
>
                  <img
                    src={artist.img}
                    alt={artist.name}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-lg">{artist.name}</h3>
                    <p className="text-xs text-zinc-300">{artist.tag}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-gradient-to-r from-black via-red-950/40 to-black border border-yellow-400/30 p-8 grid lg:grid-cols-2 gap-8">
          <div>
            <p className="text-yellow-300 font-bold mb-2">
              AUTOMATED PUBLIC INQUIRY SYSTEM
            </p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              MaBon AI Concierge for Calls, Emails, and Website Questions
            </h2>
            <p className="text-zinc-300">
              This assistant helps MaBon Music LLC answer common questions,
              collect verified contact details, screen suspicious inquiries,
              and forward serious opportunities to the right person.
            </p>
          </div>

          <div className="bg-black/50 border border-yellow-400/20 rounded-3xl p-5">
            <h3 className="font-black text-xl mb-3">🤖 MaBon AI Concierge</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-zinc-900 rounded-2xl p-3">
                Welcome to MaBon Music LLC. Are you contacting us about
                submissions, merch, booking, licensing, partnerships, or
                support?
              </div>
              <div className="bg-red-950/40 rounded-2xl p-3 ml-8">
                Please provide your full name, callback number, email, and
                reason for contacting MaBon Music LLC.
              </div>
              <div className="bg-zinc-900 rounded-2xl p-3">
                Serious business inquiries will be forwarded. Suspicious or
                fraudulent messages may be blocked and logged.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-red-950/60 via-zinc-950 to-black border border-yellow-400/30 p-8 grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-yellow-300 font-bold mb-2">
              PUBLIC SUBMISSION PORTAL
            </p>
            <h2 className="text-3xl font-black mb-3">
              Submit music to MaBon Music LLC engineers
            </h2>
            <p className="text-zinc-300 mb-5">
              Artists can upload tracks, lyrics, videos, press kits, and social
              links for professional review.
            </p>
            <button className="bg-white text-black px-6 py-3 rounded-full font-bold">
              Start Submission
            </button>
          </div>

          <div className="bg-black/40 rounded-2xl p-5 border border-red-900/40">
            <h3 className="font-bold mb-4">Submission Form Preview</h3>
            {[
              "Artist Name",
              "Email Address",
              "Upload MP3 / WAV / Video",
              "Social Media Links",
              "Message to MaBon Music LLC",
            ].map((field) => (
              <div
                key={field}
                className="bg-white/5 rounded-xl p-3 text-sm text-zinc-400 mb-3"
              >
                {field}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}