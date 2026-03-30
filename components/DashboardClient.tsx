"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { formatDateTime, formatTimeRange, getBrowserTimeZone } from "@/lib/dates";

type Slot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  isBooked: boolean;
};

type Booking = {
  _id: string;
  bookedByName: string;
  bookedByEmail: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  notes?: string;
};

type DashboardData = {
  user: {
    name: string;
    email: string;
    username: string;
  };
  bookingLink: string;
  slots: Slot[];
  bookings: Booking[];
  suggestion: {
    reasoning: string;
    slot: Slot;
  } | null;
};

type DashboardClientProps = {
  initialUser: {
    name: string;
    username: string;
  };
};

export function DashboardClient({ initialUser }: DashboardClientProps) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slotForm, setSlotForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    timeZone: getBrowserTimeZone()
  });

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load dashboard.");
      }

      setDashboard(data);
    } catch (dashboardError) {
      setError(
        dashboardError instanceof Error
          ? dashboardError.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function createSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slotForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not save slot.");
      }

      setSlotForm({
        date: "",
        startTime: "",
        endTime: "",
        timeZone: getBrowserTimeZone()
      });
      await loadDashboard();
    } catch (slotError) {
      setError(slotError instanceof Error ? slotError.message : "Could not save slot.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const userTimeZone = useMemo(() => getBrowserTimeZone(), []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">
                {dashboard?.user.name ?? initialUser.name}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Share your booking page and keep your schedule flexible.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-2xl border border-cyan/40 bg-cyan/10 px-4 py-3 text-sm font-medium text-cyan transition hover:bg-cyan/20"
                href={dashboard?.bookingLink ?? `/book/${initialUser.username}`}
                target="_blank"
              >
                Open booking page
              </a>
              <button
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
                onClick={logout}
                type="button"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-ink shadow-glow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Add availability</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Create open time blocks in your own time zone.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {slotForm.timeZone}
                </span>
              </div>

              <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={createSlot}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Date</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white"
                    required
                    type="date"
                    value={slotForm.date}
                    onChange={(event) =>
                      setSlotForm((current) => ({ ...current, date: event.target.value }))
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Time zone
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white"
                    required
                    value={slotForm.timeZone}
                    onChange={(event) =>
                      setSlotForm((current) => ({
                        ...current,
                        timeZone: event.target.value
                      }))
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Start time
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white"
                    required
                    type="time"
                    value={slotForm.startTime}
                    onChange={(event) =>
                      setSlotForm((current) => ({
                        ...current,
                        startTime: event.target.value
                      }))
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    End time
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white"
                    required
                    type="time"
                    value={slotForm.endTime}
                    onChange={(event) =>
                      setSlotForm((current) => ({
                        ...current,
                        endTime: event.target.value
                      }))
                    }
                  />
                </label>

                <button
                  className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? "Saving slot..." : "Save slot"}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Open slots</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Upcoming time blocks visible on your public page.
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                  {dashboard?.slots.length ?? 0} total
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <p className="text-sm text-slate-400">Loading slots...</p>
                ) : dashboard?.slots.length ? (
                  dashboard.slots.map((slot) => (
                    <article
                      key={slot._id}
                      className="rounded-3xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {formatDateTime(slot.startTime, userTimeZone, {
                              weekday: "short",
                              month: "short",
                              day: "numeric"
                            })}
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            {formatTimeRange(slot.startTime, slot.endTime, userTimeZone)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            slot.isBooked
                              ? "bg-rose-500/20 text-rose-200"
                              : "bg-emerald-500/20 text-emerald-200"
                          }`}
                        >
                          {slot.isBooked ? "Booked" : "Available"}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-3xl border border-dashed border-white/15 px-4 py-5 text-sm text-slate-400">
                    No availability yet. Add your first slot to start taking bookings.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-cyan/30 bg-cyan/10 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan">
                AI Suggestion
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Best slot to promote first
              </h2>
              {dashboard?.suggestion ? (
                <>
                  <p className="mt-4 text-lg text-white">
                    {formatDateTime(dashboard.suggestion.slot.startTime, userTimeZone)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-cyan-50">
                    {dashboard.suggestion.reasoning}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm leading-6 text-cyan-50">
                  Add a few open slots and the app will suggest the strongest meeting time.
                </p>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-ink shadow-glow">
              <h2 className="text-xl font-semibold">Public booking link</h2>
              <p className="mt-2 text-sm text-slate-500">
                Share this with clients so they can book without logging in.
              </p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 break-all">
                {dashboard?.bookingLink ?? `/book/${initialUser.username}`}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Scheduled meetings</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Bookings collected from your public page.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <p className="text-sm text-slate-400">Loading meetings...</p>
                ) : dashboard?.bookings.length ? (
                  dashboard.bookings.map((booking) => (
                    <article
                      key={booking._id}
                      className="rounded-3xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {booking.bookedByName}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {booking.bookedByEmail}
                      </p>
                      <p className="mt-3 text-sm text-slate-200">
                        {formatDateTime(booking.startTime, userTimeZone)}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Ends {formatDateTime(booking.endTime, userTimeZone)}
                      </p>
                      {booking.notes ? (
                        <p className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-sm text-slate-300">
                          {booking.notes}
                        </p>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <p className="rounded-3xl border border-dashed border-white/15 px-4 py-5 text-sm text-slate-400">
                    No meetings booked yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
