"use client";

import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { supabase } from "@/lib/supabaseClient";

const DEADLINE = new Date("2026-09-10T23:59:59-07:00");
const SUBMISSION_LIMIT = 100;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

type ContestSubmission = {
  id: number;
  artist_name: string | null;
  song_selected: string | null;
  video_file_path: string | null;
  video_file_name: string | null;
  vote_count: number | null;
  status: string | null;
  signedUrl?: string;
};

const creatorCategories = [
  "Dancers",
  "Videographers",
  "Video Editors",
  "Photographers",
  "Models",
  "Actors",
  "Influencers",
  "DJs",
  "Producers",
];

export default function DanceChallenge() {
    const ffmpegRef = useRef<FFmpeg | null>(null);

const compressVideo = async (videoFile: File) => {
  if (!ffmpegRef.current) {
  ffmpegRef.current = new FFmpeg();
}

const ffmpeg = ffmpegRef.current;

  if (!ffmpeg.loaded) {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  }

  const inputName = "input-video";
  const outputName = "compressed-video.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

  await ffmpeg.exec([
    "-i",
    inputName,
    "-vf",
    "scale=-2:720",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "30",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

if (typeof data === "string") {
  throw new Error("Video compression returned an invalid file.");
}

const videoBytes = new Uint8Array(data);

const compressedBlob = new Blob([videoBytes], {
  type: "video/mp4",
});

  return new File(
    [compressedBlob],
    `compressed-${videoFile.name.replace(/\.[^/.]+$/, "")}.mp4`,
    { type: "video/mp4" }
  );
};
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [submissionsReceived, setSubmissionsReceived] = useState(0);
  const [approvedSubmissions, setApprovedSubmissions] = useState<
    ContestSubmission[]
  >([]);

  const [loadingContest, setLoadingContest] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const [ageGroup, setAgeGroup] = useState("");
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const spotsRemaining = Math.max(
    SUBMISSION_LIMIT - submissionsReceived,
    0
  );

  useEffect(() => {
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = DEADLINE.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (distance / (1000 * 60)) % 60
        ),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }

    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    loadContestData();
  }, []);

  async function loadContestData() {
    setLoadingContest(true);

    const { count, error: countError } = await supabase
      .from("artist_submissions")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("submission_type", "dance_challenge");

    if (!countError) {
      setSubmissionsReceived(count || 0);
    }

    const { data, error } = await supabase
      .from("artist_submissions")
      .select(
        `
          id,
          artist_name,
          song_selected,
          video_file_path,
          video_file_name,
          vote_count,
          status
        `
      )
      .eq("submission_type", "dance_challenge")
      .eq("status", "Approved")
      .not("video_file_path", "is", null)
      .order("created_at", {
        ascending: true,
      })
      .limit(12);

    if (!error && data) {
      const entriesWithUrls = await Promise.all(
        data.map(async (entry) => {
          if (!entry.video_file_path) {
            return entry;
          }

          const { data: signedData } =
            await supabase.storage
              .from("artist-submissions")
              .createSignedUrl(
                entry.video_file_path,
                3600
              );

          return {
            ...entry,
            signedUrl: signedData?.signedUrl,
          };
        })
      );

      setApprovedSubmissions(entriesWithUrls);
    }

    setLoadingContest(false);
  }

  function scrollToEntry() {
    document
      .getElementById("dance-entry-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function scrollToVoting() {
    document
      .getElementById("public-voting")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function getVideoDuration(file: File) {
    return new Promise<number>((resolve, reject) => {
      const video = document.createElement("video");
      const objectUrl = URL.createObjectURL(file);

      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const duration = video.duration;
        URL.revokeObjectURL(objectUrl);
        resolve(duration);
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(
          new Error("Unable to read video duration.")
        );
      };

      video.src = objectUrl;
    });
  }
async function handleVote(entryId: number) {
  try {
    let voterId = localStorage.getItem("mabon-voter-id");

    if (!voterId) {
      voterId = crypto.randomUUID();
      localStorage.setItem("mabon-voter-id", voterId);
    }

    const response = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contestantId: entryId,
        voterId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.error === "cooldown") {
        alert(
          result.message ||
            "You must wait before voting for this contestant again."
        );
        return;
      }

      alert(
        result.error ||
          "Your vote could not be submitted. Please try again."
      );
      return;
    }

    setApprovedSubmissions((current) =>
      current.map((item) =>
        item.id === entryId
          ? {
              ...item,
              vote_count: result.voteCount,
            }
          : item
      )
    );

    alert(
      "Vote counted! You can vote for this contestant again in 30 minutes."
    );
  } catch (error) {
    console.error("Vote request failed:", error);

    alert(
      "Your vote could not be submitted. Please check your connection and try again."
    );
  }
}

  async function handleDanceSubmission(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSubmissionMessage("");
    setSubmissionError("");

    if (submissionsReceived >= SUBMISSION_LIMIT) {
      setSubmissionError(
        "All available Dance Challenge submission spaces have been filled."
      );
      return;
    }

    if (new Date() > DEADLINE) {
      setSubmissionError(
        "The Dance Challenge submission deadline has passed."
      );
      return;
    }

    if (!ageGroup) {
      setSubmissionError(
        "Please confirm the participant's age group."
      );
      return;
    }

    if (ageGroup === "under18" && !guardianConsent) {
      setSubmissionError(
        "Participants under 18 require parent or legal guardian authorization."
      );
      return;
    }

    if (!termsAccepted) {
      setSubmissionError(
        "You must accept the Official Rules and Submission Terms before entering."
      );
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const videoFile = formData.get(
      "video_file"
    ) as File | null;

    if (!videoFile || videoFile.size === 0) {
      setSubmissionError(
        "Please select a dance video to upload."
      );
      return;
    }

    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ];

    if (!allowedTypes.includes(videoFile.type)) {
      setSubmissionError(
        "Please upload an MP4, MOV, or WebM video."
      );
      return;
    }

    

    setSubmitting(true);

    try {
      const duration = await getVideoDuration(videoFile);

      if (duration < 55 || duration > 95) {
        setSubmissionError(
          "Dance videos should be approximately 1 minute to 1 minute 30 seconds long."
        );
        setSubmitting(false);
        return;
      }
setSubmissionMessage("Preparing and compressing your video...");

let fileToUpload = videoFile;

try {
  if (videoFile.size > MAX_VIDEO_SIZE) {
    fileToUpload = await compressVideo(videoFile);
  }
} catch (error) {
  console.error("Video compression failed:", error);
  setSubmissionError(
    "We could not prepare your video for upload. Please try again."
  );
  setSubmitting(false);
  return;
}

if (fileToUpload.size > MAX_VIDEO_SIZE) {
  setSubmissionError(
    "Your video is still too large after automatic compression. Please try a lower-resolution recording."
  );
  setSubmitting(false);
  return;
}
      const safeName = fileToUpload.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const videoFilePath =
        `dance-challenge/${Date.now()}-${safeName}`;

      const uploadResult = await supabase.storage
        .from("artist-submissions")
        .upload(videoFilePath, fileToUpload, {
          cacheControl: "3600",
          upsert: false,
          contentType: fileToUpload.type,
        });

      if (uploadResult.error) {
        setSubmissionError(
          `Video upload failed: ${uploadResult.error.message}`
        );
        setSubmitting(false);
        return;
      }

      const dancerName = String(
        formData.get("dancer_name") || ""
      ).trim();

      const email = String(
        formData.get("email") || ""
      ).trim();

      const phone = String(
        formData.get("phone") || ""
      ).trim();

      const socialHandle = String(
        formData.get("social_handle") || ""
      ).trim();

      const songSelected = String(
        formData.get("song_selected") || ""
      ).trim();

      const { error: insertError } = await supabase
        .from("artist_submissions")
        .insert({
          artist_name: dancerName,
          artist_email: email,
          phone_number: phone,

          song_title: songSelected,
          genre: "Dance Challenge",
          submission_goal: "Dance Challenge",

          backup_link: null,
          artist_message:
            "Official MaBon Music Dance Challenge submission.",
          submitted_lyrics: null,

          audio_file_path: null,
          audio_file_name: null,
          audio_file_type: null,

          status: "Submitted",

          submission_type: "dance_challenge",
          social_handle: socialHandle,
          song_selected: songSelected,

          video_file_path: videoFilePath,
          video_file_name: videoFile.name,
          video_file_type: videoFile.type,

          age_confirmed: ageGroup === "18+",
          guardian_consent:
            ageGroup === "under18"
              ? guardianConsent
              : false,

          contest_status: "Submitted",
          vote_count: 0,
        });

      if (insertError) {
        await supabase.storage
          .from("artist-submissions")
          .remove([videoFilePath]);

        setSubmissionError(
          `Submission failed: ${insertError.message}`
        );

        setSubmitting(false);
        return;
      }

      setSubmissionMessage(
        "Your Dance Challenge submission was received successfully. MaBon Music will review your entry before it becomes eligible for the public gallery."
      );

      form.reset();
      setAgeGroup("");
      setGuardianConsent(false);
      setTermsAccepted(false);

      await loadContestData();
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your video."
      );
    }

    setSubmitting(false);
  }

  return (
    <section
      id="dance-challenge"
      className="relative overflow-hidden border-t border-yellow-500/20 bg-gradient-to-br from-black via-red-950/30 to-black px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-7xl">

        {/* HERO */}

        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-yellow-400">
            MaBon Music LLC Presents
          </p>

          <h2 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl">
            Official Dance
            <br />
            Challenge
          </h2>

          <div className="mx-auto mt-8 h-px max-w-2xl bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

          <h3 className="mt-8 text-3xl font-black uppercase text-yellow-400">
            Become the Next Face of MaBon Music
          </h3>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-200">
            MaBon Music LLC is searching for talented
            dancers with originality, creativity,
            confidence, personality, energy, and star
            power.
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-lg leading-8 text-zinc-200">
            Choose any MaBon Music song that inspires
            you, create original choreography, and
            submit a dance video between{" "}
            <strong>
              1 minute and 1 minute 30 seconds.
            </strong>
          </p>

          <button
            type="button"
            onClick={scrollToEntry}
            className="mt-8 rounded-xl border border-yellow-300 bg-yellow-400 px-12 py-4 text-lg font-black uppercase tracking-wide text-black shadow-lg shadow-yellow-500/10 transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-500/20"
          >
            Enter the Challenge
          </button>
        </div>

        {/* DEADLINE */}

        <section className="mx-auto mt-16 max-w-5xl rounded-[2rem] border border-yellow-500/40 bg-black/70 p-8">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-red-400">
              Submission Deadline
            </p>

            <h3 className="mt-3 text-2xl font-black uppercase text-yellow-400 md:text-3xl">
              September 10, 2026 • 11:59 PM Pacific
            </h3>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Days", timeLeft.days],
              ["Hours", timeLeft.hours],
              ["Minutes", timeLeft.minutes],
              ["Seconds", timeLeft.seconds],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-2xl border border-yellow-500/30 bg-zinc-950 p-6 text-center"
              >
                <p className="text-4xl font-black">
                  {String(value).padStart(2, "0")}
                </p>

                <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AVAILABILITY */}

        <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-red-700/50 bg-red-950/40 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
                Limited Availability
              </p>

              <h3 className="mt-2 text-3xl font-black uppercase text-yellow-400">
                {spotsRemaining} Submission Spots
                Available
              </h3>

              <p className="mt-2 text-zinc-300">
                Registration may close early once all
                available spaces are filled.
              </p>
            </div>

            <div className="min-w-[170px] rounded-2xl border border-yellow-500/40 bg-black p-6 text-center">
              <p className="text-4xl font-black">
                {submissionsReceived}/{SUBMISSION_LIMIT}
              </p>

              <p className="mt-2 text-xs font-black uppercase text-yellow-400">
                Entries Received
              </p>
            </div>
          </div>
        </section>

        {/* HOW TO ENTER */}

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-yellow-500/30 bg-black/70 p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              Step One
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase text-yellow-400">
              How to Enter
            </h3>

            <div className="mt-8 space-y-5 text-lg leading-8">
              <p>
                <strong>01.</strong> Choose any MaBon
                Music song.
              </p>

              <p>
                <strong>02.</strong> Create your own
                original choreography.
              </p>

              <p>
                <strong>03.</strong> Record a dance
                video between 1:00 and 1:30.
              </p>

              <p>
                <strong>04.</strong> Provide your name,
                contact information, social-media
                handle, and song selected.
              </p>

              <p>
                <strong>05.</strong> Confirm eligibility
                and accept the Official Rules and
                Submission Terms.
              </p>

              <p>
                <strong>06.</strong> Upload your video
                through the MaBon Creator Portal.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-yellow-500/30 bg-black/70 p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              Step Two
            </p>

            <h3 className="mt-2 text-3xl font-black uppercase text-yellow-400">
              What Happens Next?
            </h3>

            <div className="mt-8 space-y-7 text-lg leading-8">
              <p>
                Eligible submissions may be featured
                directly on the MaBon Music website and
                official social platforms.
              </p>

              <p>
                Approved videos may still be showcased
                even if that entrant does not ultimately
                win.
              </p>

              <p>
                Qualifying entries may advance to the{" "}
                <strong>
                  MaBon Music Public Voting Gallery.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* PUBLIC VOTING */}

        <section
          id="public-voting"
          className="scroll-mt-28 mt-14 rounded-[2rem] border border-red-700/50 bg-gradient-to-br from-red-950/40 via-black to-red-950/30 p-8"
        >
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-red-400">
              The People Have a Voice
            </p>

            <h3 className="mt-3 text-4xl font-black uppercase text-yellow-400">
              Public Voting
            </h3>

            <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-zinc-200">
              Qualifying videos can appear directly on
              the MaBon Music website so supporters can
              watch and share their favorite
              performances.
            </p>
          </div>

          {loadingContest ? (
            <p className="mt-10 text-center text-yellow-400">
              Loading contestants...
            </p>
          ) : approvedSubmissions.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {approvedSubmissions.map((entry) => (
                <article
                  key={entry.id}
                  className="overflow-hidden rounded-3xl border border-yellow-500/30 bg-black"
                >
                  <div className="aspect-[9/12] bg-zinc-950">
                    {entry.signedUrl ? (
                      <video
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover"
                      >
                        <source
                          src={entry.signedUrl}
                        />
                      </video>
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-500">
                        Video unavailable
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h4 className="text-2xl font-black uppercase">
                      {entry.artist_name ||
                        "Featured Dancer"}
                    </h4>

                    <p className="mt-2 text-yellow-400">
                      {entry.song_selected ||
                        "MaBon Music Selection"}
                    </p>

                    <p className="mt-4 text-sm uppercase tracking-widest text-zinc-400">
                      {entry.vote_count || 0} Votes
                    </p>

                    <button
                      type="button"
                      onClick={() => handleVote(entry.id)}
                      className="mt-4 rounded-xl bg-yellow-400 px-8 py-3 font-black uppercase tracking-wider text-black transition hover:bg-yellow-300"
                    >
                      Vote
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((number) => (
                <div
                  key={number}
                  className="overflow-hidden rounded-3xl border border-yellow-500/30 bg-black"
                >
                  <div className="flex aspect-[9/12] flex-col items-center justify-center bg-gradient-to-br from-red-950/50 to-black">
                    <div className="text-6xl">
                      ▶
                    </div>

                    <p className="mt-6 uppercase tracking-widest text-zinc-500">
                      Contest Video
                    </p>
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-black uppercase">
                      Featured Dancer #{number}
                    </h4>

                    <p className="mt-2 text-zinc-500">
                      Waiting for an approved entry
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-zinc-400">
  Public voting is open for approved contestants. Supporters may vote again every
  30 minutes. MaBon Music LLC reserves the right to verify votes and remove
  fraudulent, automated, or manipulated activity.
</p>
        </section>

        {/* OPPORTUNITIES */}

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-yellow-500/30 bg-black/70 p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              Paid Opportunities
            </p>

            <h3 className="mt-3 text-3xl font-black uppercase">
              $100 Per Approved Video
            </h3>

            <p className="mt-5 text-lg leading-8 text-zinc-200">
              Selected dancers may be invited to create
              approved dance content for future MaBon
              Music releases and promotional campaigns.
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-500/30 bg-black/70 p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">
              Grand Opportunity
            </p>

            <h3 className="mt-3 text-3xl font-black uppercase text-yellow-400">
              Become the Face of MaBon Music
            </h3>

            <p className="mt-5 text-lg leading-8 text-zinc-200">
              A selected winner may receive paid
              promotional opportunities, featured
              appearances, and additional collaborations
              subject to a separate written agreement.
            </p>
          </div>
        </section>

        {/* AGE */}

        <section className="mt-12 rounded-3xl border border-yellow-500/30 bg-black/70 p-8">
          <h3 className="text-3xl font-black uppercase text-yellow-400">
            Age & Eligibility
          </h3>

          <p className="mt-6 text-lg leading-8 text-zinc-200">
            Participants 18 years of age or older may
            be required to provide age-verification
            information.
          </p>

          <p className="mt-4 text-lg leading-8 text-zinc-200">
            Participants under 18 must have
            authorization from a parent or legal
            guardian before an entry can become
            eligible.
          </p>
        </section>

        {/* TERMS */}

        <section className="mt-8 rounded-3xl border border-zinc-700 bg-zinc-950/80 p-8">
          <h3 className="text-3xl font-black uppercase text-yellow-400">
            Submission Terms
          </h3>

          <div className="mt-6 space-y-5 leading-8 text-zinc-300">
            <p>
              By submitting a video, the entrant
              represents that they have the legal right
              to submit the performance and
              choreography.
            </p>

            <p>
              The entrant grants MaBon Music LLC a
              worldwide, royalty-free license to review,
              reproduce, edit, display, publish,
              distribute, promote, advertise, and
              otherwise use the submitted video,
              performance, name, approved likeness, and
              related submission materials in
              connection with the promotion, MaBon Music
              platforms, publicity, marketing, and
              promotional activities, subject to the
              Official Rules.
            </p>

            <p>
              Submission alone does not make an entrant
              an employee, contractor, representative,
              exclusive artist, or winner of MaBon Music
              LLC. Paid services, exclusive rights,
              representation, or continuing business
              relationships require a separate written
              agreement.
            </p>
          </div>
        </section>

        {/* ENTRY FORM */}

        <section
          id="dance-entry-form"
          className="scroll-mt-28 mt-14 rounded-[2rem] border border-yellow-500/40 bg-gradient-to-br from-red-950/50 via-black to-black p-8 md:p-12"
        >
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-red-400">
              MaBon Creator Portal
            </p>

            <h3 className="mt-4 text-4xl font-black uppercase md:text-5xl">
              Upload Your Dance Video
            </h3>

            <p className="mx-auto mt-4 max-w-3xl text-zinc-300">
              Complete the entry form below. Your video
              will be privately reviewed before it can
              appear in the Public Voting Gallery.
            </p>
          </div>

          {submissionMessage && (
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-green-500/50 bg-green-950/40 p-5 text-green-300">
              {submissionMessage}
            </div>
          )}

          {submissionError && (
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-500/60 bg-red-950/50 p-5 text-red-200">
              {submissionError}
            </div>
          )}

          <form
            onSubmit={handleDanceSubmission}
            className="mx-auto mt-10 max-w-4xl space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="dancer_name"
                required
                placeholder="Dancer / Performer Name"
                className="w-full rounded-xl border border-yellow-500/30 bg-zinc-950 p-4 outline-none focus:border-yellow-400"
              />

              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full rounded-xl border border-yellow-500/30 bg-zinc-950 p-4 outline-none focus:border-yellow-400"
              />

              <input
                name="phone"
                required
                placeholder="Phone Number"
                className="w-full rounded-xl border border-yellow-500/30 bg-zinc-950 p-4 outline-none focus:border-yellow-400"
              />

              <input
                name="social_handle"
                required
                placeholder="Social Media Handle"
                className="w-full rounded-xl border border-yellow-500/30 bg-zinc-950 p-4 outline-none focus:border-yellow-400"
              />
            </div>

            <input
              name="song_selected"
              required
              placeholder="MaBon Music Song Selected"
              className="w-full rounded-xl border border-yellow-500/30 bg-zinc-950 p-4 outline-none focus:border-yellow-400"
            />

            <select
              required
              value={ageGroup}
              onChange={(e) =>
                setAgeGroup(e.target.value)
              }
              className="w-full rounded-xl border border-yellow-500/30 bg-zinc-950 p-4"
            >
              <option value="">
                Select Participant Age Group
              </option>

              <option value="18+">
                18 Years of Age or Older
              </option>

              <option value="under18">
                Under 18 Years of Age
              </option>
            </select>

            {ageGroup === "under18" && (
              <label className="flex gap-3 rounded-xl border border-red-700/50 bg-red-950/30 p-5">
                <input
                  type="checkbox"
                  checked={guardianConsent}
                  onChange={(e) =>
                    setGuardianConsent(
                      e.target.checked
                    )
                  }
                  className="mt-1"
                />

                <span className="text-sm leading-6 text-zinc-300">
                  I confirm that a parent or legal
                  guardian has authorized this
                  submission. Additional guardian
                  verification may be required before
                  the entry becomes eligible.
                </span>
              </label>
            )}

            <div className="rounded-2xl border border-yellow-500/30 bg-zinc-950 p-5">
              <label className="block font-black uppercase text-yellow-400">
                Dance Video
              </label>

              <p className="mt-2 text-sm text-zinc-400">
                MP4, MOV, or WebM. Video length: approximately 1:00–1:30. Larger videos will be automatically optimized for upload.
              </p>

              <input
                name="video_file"
                type="file"
                required
                accept="video/mp4,video/quicktime,video/webm"
                className="mt-4 block w-full rounded-xl border border-yellow-500/30 bg-black p-4"
              />
            </div>

            <label className="flex gap-3 rounded-xl border border-yellow-500/20 bg-black/60 p-5">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) =>
                  setTermsAccepted(e.target.checked)
                }
                className="mt-1"
              />

              <span className="text-sm leading-6 text-zinc-300">
                I have read and agree to the MaBon
                Music Official Rules and Submission
                Terms shown above, and I confirm that I
                have the legal right to submit this
                video and choreography.
              </span>
            </label>

            <button
              type="submit"
              disabled={
                submitting ||
                submissionsReceived >=
                  SUBMISSION_LIMIT
              }
              className="w-full rounded-xl border border-yellow-300 bg-yellow-400 px-10 py-5 text-lg font-black uppercase tracking-wide text-black shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Uploading Submission..."
                : submissionsReceived >=
                    SUBMISSION_LIMIT
                  ? "Submissions Full"
                  : "Submit Dance Challenge Entry"}
            </button>
          </form>
        </section>

        {/* CREATOR PORTAL CTA */}

        <section className="mt-16 rounded-[2rem] border border-yellow-500/40 bg-black/80 p-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-400">
            MaBon Creator Portal
          </p>

          <h3 className="mt-5 text-4xl font-black uppercase md:text-5xl">
            Ready to Show Us What You&apos;ve Got?
          </h3>

          <div className="mt-8 text-2xl font-black uppercase leading-9 text-yellow-400">
            <p>Choose the Song.</p>
            <p>Create the Dance.</p>
            <p>Upload Your Video.</p>
            <p>Get the People Behind You.</p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={scrollToEntry}
              className="rounded-xl border border-yellow-300 bg-yellow-400 px-12 py-4 text-lg font-black uppercase text-black transition duration-300 hover:-translate-y-1 hover:bg-yellow-300"
            >
              Upload Your Video
            </button>

            <button
              type="button"
              onClick={scrollToVoting}
              className="rounded-xl border border-yellow-500/60 bg-black px-12 py-4 text-lg font-black uppercase text-yellow-400 transition duration-300 hover:-translate-y-1 hover:bg-yellow-400 hover:text-black"
            >
              View Contestants
            </button>
          </div>
        </section>

        {/* CREATOR NETWORK */}

        <section className="mt-16 text-center">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-400">
            More Than a Contest
          </p>

          <h3 className="mt-4 text-4xl font-black uppercase text-yellow-400">
            Join the MaBon Creator Network
          </h3>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-300">
            The Dance Challenge is only the beginning.
            MaBon Music is building a network of
            creatives who can collaborate on future
            music, visuals, campaigns, and entertainment
            projects.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {creatorCategories.map((category) => (
              <div
                key={category}
                className="rounded-2xl border border-yellow-500/30 bg-black/70 p-6 text-lg font-black uppercase transition hover:border-yellow-400 hover:bg-yellow-400/5"
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}

        <section className="mt-16 rounded-[2rem] border border-red-700/50 bg-gradient-to-r from-red-950/50 via-black to-red-950/30 p-10 text-center">
          <h3 className="text-4xl font-black uppercase md:text-5xl">
            Ready to Become the Next Face of MaBon
            Music?
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
            Upload your dance, build public support,
            compete for paid opportunities, and become
            part of the growing MaBon Creator Network.
          </p>

          <button
            type="button"
            onClick={scrollToEntry}
            className="mt-8 rounded-xl border border-yellow-300 bg-yellow-400 px-14 py-5 text-lg font-black uppercase text-black transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-500/20"
          >
            Enter the Challenge
          </button>
        </section>

      </div>
    </section>
  );
}