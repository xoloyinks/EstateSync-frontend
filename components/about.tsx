import React from 'react'

export default function About() {
  return (
    <section className="min-h-screen space-y-5 overflow-x-hidden sm:py-32 sm:px-20 p-3 flex flex-col justify-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-right">
        THE <span className="text-5xl sm:text-6xl">HEART</span> OF REAL <br className="hidden sm:block" /> ESTATE HERE FOR YOU
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-5 h-full overflow-hidden">
        <div className="sm:w-[40%] w-full overflow-hidden relative rounded min-h-[220px] max-h-[350px] sm:max-h-none">
          <img
            alt="About us"
            src={'/images/prop5.jpg'}
            className="object-cover w-full h-full rounded"
            style={{ minHeight: 180, maxHeight: 350 }}
          />
        </div>
        <div className="flex flex-col justify-center w-full sm:w-[50%] gap-3">
          <h2 className="text-black font-semibold text-lg sm:text-xl">
            About EstateSync
          </h2>
          <p className="text-xs sm:text-sm">
            EstateSync was born out of the real-world challenges faced by estate supervisors in managing tenant information, rent payments, and communication across multiple estates. With traditional methods proving to be inefficient and error-prone, EstateSync was developed to bring structure, ease, and transparency to estate management.
            <br /><br />
            Founded by a team passionate about digital transformation in real estate, EstateSync is more than just a software—it&apos;s a solution built from lived experience. With five estates as its pilot case, EstateSync aims to become the preferred tool for estate supervisors, facility managers, and landlords across Nigeria and beyond.
            <br /><br />
            We&apos;re committed to simplifying processes, improving tenant-supervisor relationships, and offering a secure and user-friendly experience that evolves with the dynamic needs of property management.
          </p>
          <div className="flex gap-2 sm:gap-5 mt-4">
            <div className="border-4 border-gray-300 bg-white rounded-full w-28 h-28 sm:w-36 sm:h-36 flex items-center flex-col justify-center">
              <p className="text-xl sm:text-2xl font-semibold">4+</p>
              <p className="text-xs">Industry Years</p>
            </div>
            <div className="border-4 border-gray-300 bg-white rounded-full w-28 h-28 sm:w-36 sm:h-36 flex items-center flex-col justify-center -translate-x-6 sm:-translate-x-12">
              <p className="text-xl sm:text-2xl font-semibold">10+</p>
              <p className="text-xs">Awards & Honors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}