"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [recoveryEmail, setRecoveryEmail] =
    useState("");

  const [resetLoading, setResetLoading] =
    useState(false);

  const [resetMessage, setResetMessage] =
    useState("");

  async function login() {
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      alert("Please enter the staff password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password: cleanPassword,
          }),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        window.location.href =
          "/admin/submissions";
        return;
      }

      alert(
        data?.message ||
          "Incorrect password."
      );
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      alert(
        "Unable to contact the login server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function requestPasswordReset() {
    const cleanEmail =
      recoveryEmail
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      setResetMessage(
        "Please enter your recovery email."
      );
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      const response = await fetch(
        "/api/admin/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await response.json();

      setResetMessage(
        data?.message ||
          "If that email matches the authorized recovery account, a reset link will be sent."
      );
    } catch (error) {
      console.error(
        "Password reset request failed:",
        error
      );

      setResetMessage(
        "Unable to process password recovery right now."
      );
    } finally {
      setResetLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      login();
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-950 border border-yellow-500/20 rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-black text-white mb-2">
          MaBon Staff Login
        </h1>

        <p className="text-zinc-400 mb-8">
          Authorized personnel only.
        </p>

        {!showForgotPassword ? (
          <>
            <div className="relative mb-6">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Staff Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                autoComplete="current-password"
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
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-400 text-xl"
              >
                {showPassword
                  ? "🙈"
                  : "👁"}
              </button>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl py-4 transition"
            >
              {loading
                ? "Checking..."
                : "Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(
                  true
                );

                setResetMessage("");
              }}
              className="w-full mt-5 text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Forgot Password?
            </button>
          </>
        ) : (
          <>
            <div className="bg-black border border-yellow-500/20 rounded-2xl p-5 mb-6">
              <h2 className="text-xl font-black text-white">
                Reset Staff Password
              </h2>

              <p className="text-zinc-400 mt-2 text-sm leading-6">
                Enter the authorized
                recovery email for the
                MaBon Staff account.
              </p>
            </div>

            <input
              type="email"
              placeholder="Recovery Email"
              value={recoveryEmail}
              onChange={(e) =>
                setRecoveryEmail(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-black border border-zinc-700 text-white mb-4"
            />

            <button
              type="button"
              onClick={
                requestPasswordReset
              }
              disabled={resetLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl py-4 transition"
            >
              {resetLoading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

            {resetMessage && (
              <div className="mt-5 bg-zinc-900 border border-zinc-700 rounded-xl p-4">
                <p className="text-zinc-300 text-sm leading-6">
                  {resetMessage}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(
                  false
                );

                setResetMessage("");
              }}
              className="w-full mt-5 text-zinc-400 hover:text-white font-semibold"
            >
              ← Back to Login
            </button>
          </>
        )}
      </div>
    </main>
  );
}