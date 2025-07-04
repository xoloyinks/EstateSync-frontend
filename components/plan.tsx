import React from 'react'
import { FaAccusoft } from 'react-icons/fa'

export default function Plan() {
  return (
    <section className="bg-slate-900 p-10 sm:px-20 sm:py-10 space-y-10">
      <div className="flex justify-center text-white">
        <FaAccusoft className="text-6xl sm:text-8xl" />
      </div>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 justify-center items-center">
        <div className="text-white w-full sm:w-1/2 md:w-1/3 space-y-5 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">Mission Statement</h2>
          <p className="text-xs sm:text-sm not-sm:w-[80%] mx-auto">
            To revolutionize estate management through a seamless, web-based platform that simplifies tenant tracking, automates rent payments, and empowers estate supervisors to operate efficiently and transparently.
          </p>
        </div>
        <div className="text-white w-full sm:w-1/2 md:w-1/3 space-y-5 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">Vission Statement</h2>
          <p className="text-xs sm:text-sm not-sm:w-[80%] mx-auto">
            To become the leading digital solution for modern estate management, setting the standard for innovation, reliability, and user-friendly experiences in property administration across Africa and beyond.
          </p>
        </div>
      </div>
    </section>
  )
}