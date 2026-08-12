"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [linkInvalid, setLinkInvalid] =
    useState(false);

  async function resetPassword() {
    setMessage("");

    if (!token) {
      setPassword("");
      setConfirmPassword("");
      setLinkInvalid(true);

      setMessage(
        "This password reset link is invalid."
      );

      return;
    }

    if (password.length < 12) {
      setMessage(
        "Your new password must contain at least 12 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "The two passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          "Unable to reset password.";

        setMessage(errorMessage);

        if (
          errorMessage
            .toLowerCase()
            .includes("invalid") ||
          errorMessage
            .toLowerCase()
            .includes("expired")
        ) {
          setPassword("");
          setConfirmPassword("");
          setShowPassword(false);
          setLinkInvalid(true);
        }

        return;
      }

      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setSuccess(true);

      setMessage(
        "Your MaBon Staff password has been changed successfully."
      );
    } catch (error) {
      console.error(
        "Password reset failed:",
        error
      );

      setMessage(
        "Unable to reset your password right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-950 border border-yellow-500/20 rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-black text-white mb-2">
          Reset Staff Password
        </h1>

        <p className="text-zinc-400 mb-8">
          MaBon Music LLC authorized
          personnel only.
        </p>

        {!success && !linkInvalid && (
          <>
            <div className="relative mb-4">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="New Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
                className="w-full p-4 pr-14 rounded-xl bg-black border border-zinc-700 text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-400 hover:text-yellow-400"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁"}
              </button>
            </div>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              autoComplete="new-password"
              className="w-full p-4 rounded-xl bg-black border border-zinc-700 text-white mb-6"
            />

            <button
              type="button"
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl py-4 transition"
            >
              {loading
                ? "Updating..."
                : "Set New Password"}
            </button>
          </>
        )}

        {(success || linkInvalid) && (
          <a
            href="/admin"
            className="block w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl py-4 transition"
          >
            Return to Staff Login
          </a>
        )}

        {message && (
          <div
            className={`mt-6 rounded-xl border p-4 ${
              success
                ? "border-green-700 bg-green-950/40 text-green-300"
                : "border-red-700 bg-red-950/40 text-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}

function ResetPasswordLoading() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-950 border border-yellow-500/20 rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-black text-white mb-2">
          Reset Staff Password
        </h1>

        <p className="text-zinc-400">
          Loading secure password reset...
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}