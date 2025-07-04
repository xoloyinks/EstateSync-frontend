import React from 'react';
import { FaAccusoft, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <section className="bg-gray-950 text-white py-8 sm:py-16 px-4 sm:px-20 space-y-12">
      {/* Logo & Headline */}
      <div className="text-center sm:text-left">
        <FaAccusoft className="text-4xl sm:text-6xl mx-auto sm:mx-0" />
        <h2 className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight text-sky-400">
          Home is a Feeling. <br />
          Find Yours!
        </h2>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-900 rounded-xl p-6 sm:p-8">
        <div className="space-y-2 hover:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
          <p className="font-semibold text-lg sm:text-xl">E-mail</p>
          <p className="text-xl sm:text-2xl break-all text-gray-300 hover:text-white transition-colors duration-200">
            estatesync@gmail.com
          </p>
        </div>
        <div className="space-y-2 hover:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
          <p className="font-semibold text-lg sm:text-xl">Call us</p>
          <p className="text-xl sm:text-2xl text-gray-300 hover:text-white transition-colors duration-200">
            08073762637
          </p>
        </div>
        <div className="space-y-2 hover:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
          <p className="font-semibold text-lg sm:text-xl">Address</p>
          <p className="text-xl sm:text-2xl text-gray-300 hover:text-white transition-colors duration-200">
            123 Maple Street
          </p>
        </div>
      </div>

      {/* Newsletter & Socials */}
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Newsletter */}
        <div className="w-full md:w-1/2 space-y-6">
          <p className="text-2xl sm:text-3xl font-bold">Newsletter</p>
          <form className="bg-gray-800 rounded-full flex items-center overflow-hidden shadow-md">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="p-3 sm:p-4 bg-transparent text-white w-2/3 focus:outline-none focus:ring-2 focus:ring-sky-500 text-base placeholder:text-gray-400 transition-all duration-200"
              aria-label="Email for newsletter"
            />
            <button
              className="bg-sky-600 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-full hover:bg-sky-700 transition-colors duration-200 w-1/3"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Socials */}
        <div className="w-full md:w-1/2 space-y-6">
          <p className="text-2xl sm:text-3xl font-bold">Follow Us</p>
          <div className="flex gap-4 text-3xl sm:text-4xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 hover:scale-110 transition-transform duration-200"
              aria-label="Follow us on Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 hover:scale-110 transition-transform duration-200"
              aria-label="Follow us on X"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 hover:scale-110 transition-transform duration-200"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 hover:scale-110 transition-transform duration-200"
              aria-label="Follow us on YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}