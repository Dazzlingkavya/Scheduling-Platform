"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { formatDateTime, formatTimeRange, getBrowserTimeZone } from "@/lib/dates";

type PublicSlot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
};

type BookingPageData = {
  user: {
    name: string;
    username: string;
  };
  slots: PublicSlot[];
  suggestedSlotId: string | null;
};

type PublicBookingClientProps = {
  username: string;
};

export function PublicBookingClient({ username }: PublicBookingClientProps) {
  const [data, setData] = useState<BookingPageData | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    bookedByName: "",
    bookedByEmail: "",
    notes: "",
    timeZone: getBrowserTimeZone()
  });

  async function loadBookingPage() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/book/${username}`, { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not load booking page.");
      }

      setData(result);
      setSelectedSlotId(result.suggestedSlotId ?? result.slots[0]?._id ?? "");
    } catch (bookingError) {
      setError(
        bookingError instanceof Error
          ? bookingError.message
          : "Could not load booking page."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBookingPage();
  }, [username]);

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSlotId) {
      setError("Please choose an available slot.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/book/${username}/${selectedSlotId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not confirm booking.");
      }

      setSuccess("Meeting booked successfully. A calendar event was created.");
      setForm((current) => ({
        ...current,
        bookedByName: "",
        bookedByEmail: "",
        notes: ""
      }));
      await loadBookingPage();
    } catch (bookingError) {
      setError(
        bookingError instanceof Error
          ? bookingError.message
          : "Could not confirm booking."
      );
    } finally {
      setSaving(false);
    }
  }

  const viewerTimeZone = useMemo(() => getBrowserTimeZone(), []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F8FBFF_0%,#EEF2FF_48%,#FFF7ED_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-glow backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan">
              Public booking page
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              Book time with {data?.user.name ?? username}
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Pick a slot that works for you. Times are shown in your local time zone:
              <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                {viewerTimeZone}
              </span>
            </p>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <div className="mt-8 space-y-3">
              <h2 className="text-lg font-semibold text-ink">Available slots</h2>

              {loading ? (
                <p className="text-sm text-slate-500">Loading slots...</p>
              ) : data?.slots.length ? (
                data.slots.map((slot) => {
                  const isSelected = selectedSlotId === slot._id;
                  const isSuggested = data.suggestedSlotId === slot._id;

                  return (
                    <button
                      key={slot._id}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        isSelected
                          ? "border-cyan bg-cyan/10"
                          : "border-slate-200 bg-white hover:border-cyan/40"
                      }`}
                      onClick={() => setSelectedSlotId(slot._id)}
                      type="button"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {formatDateTime(slot.startTime, viewerTimeZone, {
                              weekday: "long",
                              month: "short",
                              day: "numeric"
                            })}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {formatTimeRange(slot.startTime, slot.endTime, viewerTimeZone)}
                          </p>
                        </div>
                        {isSuggested ? (
                          <span className="rounded-full bg-sun/40 px-3 py-1 text-xs font-semibold text-amber-900">
                            Suggested
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="rounded-3xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                  No open slots are available right now.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-ink/5 bg-ink p-8 text-white shadow-glow">
            <h2 className="text-2xl font-semibold">Confirm your meeting</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Fill in your details and we will lock the slot instantly.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleBooking}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Name</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white/10"
                  required
                  value={form.bookedByName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bookedByName: event.target.value
                    }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white/10"
                  required
                  type="email"
                  value={form.bookedByEmail}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      bookedByEmail: event.target.value
                    }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Notes</span>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white/10"
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Your time zone
                </span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan focus:bg-white/10"
                  required
                  value={form.timeZone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, timeZone: event.target.value }))
                  }
                />
              </label>

              <button
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!data?.slots.length || saving}
                type="submit"
              >
                {saving ? "Booking..." : "Book meeting"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
