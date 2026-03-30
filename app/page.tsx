import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#F9FBFF_0%,#F4F7FB_35%,#FFF3E8_100%)] text-ink">
      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-8 -z-10 h-80 rounded-full bg-mesh blur-3xl" />

        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-lg shadow-slate-200/50 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan">
              Calendlite
            </p>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-ink"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              href="/register"
            >
              Start free
            </Link>
          </nav>
        </header>

        <div className="grid min-h-[80vh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan">
              Scheduling made simple for one-day builds
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Build a polished booking workflow without the Calendly complexity.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Create time slots, share a public booking page, collect meetings, and
              promote your best availability with a lightweight AI suggestion engine.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                href="/register"
              >
                Create account
              </Link>
              <Link
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan hover:text-cyan"
                href="/login"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-glow backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.75rem] bg-ink p-5 text-white">
                <p className="text-sm text-cyan">Smart suggestion</p>
                <h2 className="mt-4 text-2xl font-semibold">Tuesday 3:00 PM</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  The built-in AI logic highlights the slot most likely to convert.
                </p>
              </article>

              <article className="rounded-[1.75rem] bg-white p-5 ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Public page</p>
                <h2 className="mt-4 text-2xl font-semibold text-ink">/book/sarah</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Guests can self-book in their own time zone without signing in.
                </p>
              </article>

              <article className="rounded-[1.75rem] bg-gradient-to-br from-sky-50 to-cyan/10 p-5 ring-1 ring-cyan/20">
                <p className="text-sm text-slate-600">Calendar sync</p>
                <h2 className="mt-4 text-2xl font-semibold text-ink">
                  Google-ready structure
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Events are saved in MongoDB today, with a clear path to real API sync.
                </p>
              </article>

              <article className="rounded-[1.75rem] bg-gradient-to-br from-rose-50 to-orange-50 p-5 ring-1 ring-rose-100">
                <p className="text-sm text-slate-600">Secure access</p>
                <h2 className="mt-4 text-2xl font-semibold text-ink">JWT auth</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Secure cookies plus hashed passwords keep the app simple and safe.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
