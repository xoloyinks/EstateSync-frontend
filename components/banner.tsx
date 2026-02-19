import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Banner() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white">

      {/* Background image layer */}
      <img
        src="/images/pexels-binyaminmellish-186077.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* gradient atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90" />

      {/* ambient light */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/30 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-120px] w-[600px] h-[600px] bg-indigo-500/20 blur-[160px] rounded-full" />

      {/* ===== CONTENT WRAPPER ===== */}
      <div className="relative z-20 max-w-7xl mx-auto min-h-screen px-6 sm:px-12 lg:px-20 flex items-center">

        <div className="grid lg:grid-cols-2 gap-10 w-full items-center">

          {/* ===== TEXT SIDE ===== */}
          <div className="space-y-8">

            <p className="uppercase tracking-[0.35em] text-xs text-purple-300">
              Future Living
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95]">
              Find Your
              <br />
              Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Perfect Space
              </span>
            </h1>

            <p className="max-w-md text-neutral-300">
              Experience modern properties presented through a
              refined digital experience built for exploration,
              clarity and comfort.
            </p>

            <Link
              href="/properties"
              className="group inline-flex items-center gap-4 px-7 py-4 rounded-full bg-white text-black font-semibold transition hover:gap-6"
            >
              Explore Properties
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* ===== GLASS COMPOSITION ===== */}
          <div className="relative h-[520px] hidden lg:block">

            {/* Main glass panel */}
            <div className="absolute top-0 right-0 w-[420px] h-[260px]
              backdrop-blur-xl bg-white/10 border border-white/20
              rounded-3xl shadow-2xl p-6">

              <p className="text-xs text-neutral-300 mb-2">
                Featured Property
              </p>

              <h3 className="text-xl font-semibold">
                Ocean View Residence
              </h3>

              <p className="text-sm text-neutral-400 mt-2">
                Lagos • 4 Bedrooms • Smart Living
              </p>
            </div>

            {/* Secondary glass */}
            <div className="absolute bottom-10 left-0 w-[320px] h-[200px]
              backdrop-blur-xl bg-white/5 border border-white/10
              rounded-3xl shadow-xl p-6">

              <p className="text-sm text-neutral-300">
                120+ curated homes available across premium locations.
              </p>
            </div>

            {/* Floating image tile */}
            <div className="absolute bottom-0 right-10 w-[220px] h-[220px]
              rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/pexels-akoonie-29539887.jpg"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
