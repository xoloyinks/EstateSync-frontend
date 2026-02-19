import React from "react";
import { FaStar } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";

const testimonials = [
  {
    name: "Benjamin",
    text: "We couldn’t be happier with the service. The team made everything seamless and stress free. Highly recommended!",
  },
  {
    name: "Sophia",
    text: "Professional, transparent and incredibly smooth experience from start to finish.",
  },
  {
    name: "Daniel",
    text: "They helped us find a home that truly fits our lifestyle. Exceptional service.",
  },
  {
    name: "Amara",
    text: "Attention to detail and communication were outstanding throughout the process.",
  },
];

export default function Testimonial() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-24 px-6 sm:px-12 lg:px-20">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-20 relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.02em]">
          What Our Clients
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Are Saying
          </span>
        </h2>
      </div>

      {/* Testimonials grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 relative z-10">

        {testimonials.map((item, i) => (
          <div
            key={i}
            className={`
              relative p-8 rounded-3xl
              backdrop-blur-2xl
              bg-gradient-to-br from-white/15 via-white/10 to-white/5
              border border-white/20
              shadow-[0_25px_60px_rgba(0,0,0,0.45)]
              transition duration-500
              hover:translate-y-[-6px]
              ${i % 2 !== 0 ? "md:translate-y-12" : ""}
            `}
          >
            {/* glass highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent" />

            <RiDoubleQuotesL className="text-3xl text-purple-300 mb-6" />

            <p className="text-neutral-200 leading-relaxed mb-8">
              {item.text}
            </p>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg">{item.name}</p>

              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
