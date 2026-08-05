"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError("");

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!message) {
      setError("Please include a short description of your project.");
      return;
    }

    setStatus("loading");

    // Simulate network request — replace with real API route in production.
    try {
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError("Failed to send. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-[680px] mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <label className="text-sm">
          Name (optional)
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-md border border-border px-3 py-2" />
        </label>

        <label className="text-sm">
          Email (required)
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-md border border-border px-3 py-2" type="email" required />
        </label>

        <label className="text-sm">
          Brief description (required)
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 w-full rounded-md border border-border px-3 py-2 min-h-[120px]" required />
        </label>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === "loading"} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            {status === "loading" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <div className="text-sm text-muted-foreground">Thanks — I’ll reply within 48 hours.</div>
          )}
        </div>
      </div>
    </form>
  );
}
