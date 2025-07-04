import React from 'react'
import { FaStar } from 'react-icons/fa'
import { RiDoubleQuotesL } from 'react-icons/ri'
import Aesthetic from './aesthetic'

export default function Testimonial() {
  return (
    <section className="sm:px-20 sm:py-10 p-3 space-y-20 relative h-fit border overflow-x-hidden">
      <Aesthetic size="sm:text-[400px] text-[200px] " position="-left-[10%] bottom-[0px]" />
      <h2 className="text-4xl font-bold">
        WHAT OUR <br /> <span className="text-5xl">CLIENTS</span> ARE SAYING
      </h2>
      <div className="absolute text-gray-200 text-center text-4xl sm:text-8xl font-bold w-full pointer-events-none select-none">
        Our Clients Voices
      </div>
      {/* Responsive testimonials */}
      <div className="flex flex-col md:flex-row justify-evenly z-10 gap-10 md:gap-0">
        {/* Column 1 */}
        <div className="w-full md:w-[40%] space-y-10 flex flex-col items-center">
          <div className="border-4 border-gray-300 p-5 rounded-4xl sm:rounded-full backdrop-blur-sm space-y-5 h-[340px] sm:h-[400px] flex flex-col items-center justify-center w-[90%] sm:w-[70%] md:w-[50%] text-center bg-white/60">
            <RiDoubleQuotesL className="text-4xl mx-auto" />
            <p className="text-2xl font-semibold">BENJAMIN</p>
            <p className="text-sm">We couldn't be happier with the service. The team made everything seamless and stress free. Highly recommended!</p>
            <p className="text-yellow-400 flex gap-2 justify-center text-2xl">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </p>
          </div>
          <div className="border-4 border-gray-300 p-5 rounded-4xl sm:rounded-full backdrop-blur-sm space-y-5 h-[340px] sm:h-[400px] flex flex-col items-center justify-center w-[90%] sm:w-[70%] md:w-[50%] text-center bg-white/60">
            <RiDoubleQuotesL className="text-4xl mx-auto" />
            <p className="text-2xl font-semibold">BENJAMIN</p>
            <p className="text-sm">We couldn't be happier with the service. The team made everything seamless and stress free. Highly recommended!</p>
            <p className="text-yellow-400 flex gap-2 justify-center text-2xl">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </p>
          </div>
        </div>
        {/* Column 2 */}
        <div className="w-full md:w-[40%] space-y-10 flex flex-col items-center md:translate-y-10">
          <div className="border-4 border-gray-300 p-5 rounded-4xl sm:rounded-full backdrop-blur-sm space-y-5 h-[340px] sm:h-[400px] flex flex-col items-center justify-center w-[90%] sm:w-[70%] md:w-[50%] text-center bg-white/60">
            <RiDoubleQuotesL className="text-4xl mx-auto" />
            <p className="text-2xl font-semibold">BENJAMIN</p>
            <p className="text-sm">We couldn't be happier with the service. The team made everything seamless and stress free. Highly recommended!</p>
            <p className="text-yellow-400 flex gap-2 justify-center text-2xl">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </p>
          </div>
          <div className="border-4 border-gray-300 p-5 rounded-4xl sm:rounded-full backdrop-blur-sm space-y-5 h-[340px] sm:h-[400px] flex flex-col items-center justify-center w-[90%] sm:w-[70%] md:w-[50%] text-center bg-white/60">
            <RiDoubleQuotesL className="text-4xl mx-auto" />
            <p className="text-2xl font-semibold">BENJAMIN</p>
            <p className="text-sm">We couldn't be happier with the service. The team made everything seamless and stress free. Highly recommended!</p>
            <p className="text-yellow-400 flex gap-2 justify-center text-2xl">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}