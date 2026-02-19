import React from "react";
import {
  FaAccusoft,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative bg-neutral-950 text-white overflow-hidden">

      {/* ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24 space-y-20">

        {/* ===== TOP BRAND AREA ===== */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 items-start">

          <div className="space-y-6 max-w-lg">
            <FaAccusoft className="text-5xl text-purple-400" />

            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-tight">
              Home is a Feeling.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Find Yours.
              </span>
            </h2>

            <p className="text-neutral-400">
              Discover spaces designed for comfort, lifestyle and
              modern living — curated with precision and care.
            </p>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-[420px] space-y-6">
            <p className="text-xl font-semibold text-neutral-200">
              Join our newsletter
            </p>

            <form className="relative">
              <div className="
                flex items-center
                backdrop-blur-2xl
                bg-gradient-to-br from-white/15 via-white/10 to-white/5
                border border-white/20
                rounded-full
                overflow-hidden
              ">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="flex-1 bg-transparent px-6 py-4 text-sm outline-none placeholder:text-neutral-400"
                />

                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full m-1 hover:scale-105 transition"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== CONTACT GLASS PANELS ===== */}
        <div className="grid md:grid-cols-3 gap-8">

          {[
            { title: "Email", value: "estatesync@gmail.com" },
            { title: "Phone", value: "08073762637" },
            { title: "Address", value: "123 Maple Street" },
          ].map((item, i) => (
            <div
              key={i}
              className="
                relative p-8 rounded-3xl
                backdrop-blur-2xl
                bg-gradient-to-br from-white/15 via-white/10 to-white/5
                border border-white/20
                shadow-[0_25px_60px_rgba(0,0,0,0.45)]
                hover:translate-y-[-6px]
                transition duration-500
              "
            >
              {/* glass highlight */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

              <p className="text-sm text-neutral-400 mb-2">
                {item.title}
              </p>

              <p className="text-lg font-semibold break-all">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/10">

          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} EstateSync. All rights reserved.
          </p>

          <div className="flex gap-6 text-2xl">
            {[FaFacebook, FaXTwitter, FaInstagram, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    w-12 h-12 flex items-center justify-center
                    rounded-full
                    backdrop-blur-xl
                    bg-white/10
                    border border-white/20
                    hover:bg-white hover:text-black
                    transition duration-300
                  "
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
