const artists = [
  { name: "Pondoe", slug: "pondoe" },
  { name: "LoLa Baggz", slug: "lola-baggz" },
  { name: "Chinatown Nae", slug: "chinatown-nae" },
  { name: "Mortuary Luciano", slug: "mortuary-luciano" },
  { name: "Tantrum", slug: "tantrum" },
  { name: "Little D", slug: "little-d" },
  { name: "Black", slug: "black" },
  { name: "A.U.7.9.", slug: "au79" },
  { name: "O.T.G 3 Face", slug: "otg-3-face" },
  { name: "Isaiah The Prophet", slug: "isaiah-the-prophet" },
];

export default function ArtistsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <a href="/" className="text-yellow-400">
        ← Back to Home
      </a>

      <h1 className="text-5xl font-black mt-10">
        MaBon Featured Artists
      </h1>

      <p className="text-zinc-300 mt-4 max-w-2xl">
        Explore the official MaBon Music LLC roster. Each artist profile will
        include biography, music, videos, visuals, and exclusive content.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {artists.map((artist) => (
          <a
            key={artist.slug}
            href={`/artists/${artist.slug}`}
            className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400"
          >
            <h2 className="text-2xl font-bold">{artist.name}</h2>
            <p className="text-zinc-400 mt-2">
              Open official MaBon Music LLC artist profile.
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}