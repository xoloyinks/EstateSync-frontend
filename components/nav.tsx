"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaAccusoft } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { UserData } from '@/app/tokenContext';
import { userType } from '@/app/types';
import { TfiMenu } from "react-icons/tfi";
import Link from 'next/link';

export default function Nav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [ active, setActive ] = useContext(UserData);
    const [role, setRole] = useState('')
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle dropdown visibility on menu click
    const handleToggle = (): void => {
      setIsOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      // Add event listener for clicks
      document.addEventListener('mousedown', handleClickOutside);

      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      const userData = Cookies.get('user');
      if(userData){
          const data: userType = JSON.parse(userData);
          setRole(data.role || '');
      }
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);


    const handleSignout = () => { 
        console.log("Status: ", active)
        window.location.href = '/';
        Cookies.remove('token');
        Cookies.remove('user');
        setActive(false)
    }

  return (
    <section className={`w-full p-3 sm:px-20 sm:py-8 flex justify-between items-center fixed left-0 z-50 ${isScrolled ? 'bg-slate-900 text-white shadow-sm shadow-gray-800': 'bg-transparent'}`}>
        <Link href='/' className='max-sm:text-[1.2rem] text-2xl font-bold flex items-center gap-2'>
            <FaAccusoft className='text-5xl' />
            <span>EstateSync</span>
        </Link>

        <div className='sm:space-x-7 max-sm:text-sm space-x-3 font-semibold flex items-center not-sm:hidden'>
            <Link href="/" className='hover:text-black/50'>Contact us</Link>
            {/* Handle Logout */}
            {active && <button onClick={handleSignout} className='hover:text-black/50 cursor-pointer'>Sign out</button>}
            {
              active && role !== 'visitor' ? 
                 <a href={`${role === 'admin' ? '/admin' : role === 'agent' ? '/agent' : '/tenant'}`} className={`rounded  px-5 py-2 ${isScrolled ? 'bg-white text-black':'bg-black text-white'}`}>
                    Dashboard
                </a> : role === 'visitor' ?
                <a href={`/status`} className={`rounded  px-5 py-2 ${isScrolled ? 'bg-white text-black':'bg-black text-white'}`}>
                    Check status
                </a> :
                 <a href='/login' className={`rounded  px-5 py-2 ${isScrolled ? 'bg-white text-black':'bg-black text-white'}`}>
                    Sign in
                </a>
            }
        </div>

       <div className="sm:hidden relative" ref={dropdownRef}>
          <div className="text-2xl cursor-pointer" onClick={handleToggle}>
            <TfiMenu />
          </div>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl z-10 transition-all duration-200 ease-in-out transform ${
              isOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 ">
                <a href="#footer" className="block text-gray-800 ">
                  Contact us
                </a>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 ">
                {active && role !== 'visitor' ? (
                  <a
                    href={`${
                      role === 'admin'
                        ? '/admin'
                        : role === 'agent'
                        ? '/agent'
                        : '/tenant'
                    }`}
                    className={`block w-full text-center rounded px-5 py-2 ${
                      isScrolled
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-900'
                    } transition-colors duration-200`}
                  >
                    Dashboard
                  </a>
                ) : role === 'visitor' ? 
                <a href="/status"
                  className="w-full text-left text-gray-800 "
                >Check status</a>
                : (
                  <a
                    href="/login"
                    className={`block w-full text-center rounded px-5 py-2 ${
                      isScrolled
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-900'
                    } transition-colors duration-200`}
                  >
                    Sign in
                  </a>
                )}
              </li>
               <li className="px-4 py-2 hover:bg-gray-100">
                {active && (
                  <button
                    onClick={handleSignout}
                    className="w-full text-left text-gray-800 "
                  >
                    Sign out
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
    </section>
  )
}
