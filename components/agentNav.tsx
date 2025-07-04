import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { FaHouseFire, FaUser } from 'react-icons/fa6'
import pp from '@/public/images/no-image.jpg'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IoLogOutOutline } from 'react-icons/io5'
import Cookies from 'js-cookie'
import { UserData } from '@/app/tokenContext'
import { MdLock, MdOutlineDashboard, MdOutlinePayment } from 'react-icons/md'
import { SiGoogleforms } from 'react-icons/si'
import { LuMessagesSquare } from 'react-icons/lu'
import { BsHousesFill } from 'react-icons/bs'
import { userType } from '@/app/types'

export type Navs = {
    id: number,
    name: string,
    ref: string,
    icon: IconType
}

export default function AgentNav({ inView, onSlideIn }: { inView: boolean; onSlideIn: () => void }) {
    const pathName = usePathname();
    let basePath = 'agent'
    const [active, setActive] = useContext(UserData);
    const [user, setUser] = useState<userType | undefined>(undefined)
    const navs: Navs[] = [
        {
            id: 1,
            name: 'Dashboard',
            ref:  `/${basePath}`,
            icon: MdOutlineDashboard
        },
        {
            id: 2,
            name: 'Profile',
            ref: `/${basePath}/profile`,
            icon: FaUser
        },
        {
            id: 3,
            name: 'Change Password',
            ref: `/${basePath}/password`,
            icon: MdLock
        },
        {
            id: 4,
            name: 'Messages',
            ref: `/${basePath}/messages`,
            icon: LuMessagesSquare
        },
        {
            id: 5,
            name: 'Confirmed Payments',
            ref: `/${basePath}/payments`,
            icon: MdOutlinePayment
        },
        {
            id: 6,
            name: 'Assigned Properties',
            ref: `/${basePath}/properties`,
            icon: BsHousesFill
        },
        {
            id: 7,
            name: 'Inquiring Clients',
            ref: `/${basePath}/properties/inquiries`,
            icon: FaHouseFire
        },
        // {
        //     id: 8,
        //     name: 'Upload Property',
        //     ref: `/${basePath}/properties/upload`,
        //     icon: FaHouseChimneyMedical
        // },
        {
            id: 9,
            name: 'Submitted Maintenance form',
            ref: `/${basePath}/requests`,
            icon: SiGoogleforms
        }
    ]

    useEffect(() => {
      // Run once on mount to get the initial user data
      const userString = Cookies.get('user');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        if (parsedUser) {
          setUser(parsedUser);
        }
      }

      // Optional: Set up interval to periodically check for cookie changes
      const interval = setInterval(() => {
        const newUserString = Cookies.get('user');
        if (newUserString) {
          const newParsedUser = JSON.parse(newUserString);
          // Only update state if the user data has changed
          setUser((prevUser) => {
            if (JSON.stringify(prevUser) !== JSON.stringify(newParsedUser)) {
              return newParsedUser;
            }
            return prevUser;
          });
        } else {
          setUser(undefined); // Clear user if cookie is removed
        }
      }, 5000); // Check every 5 seconds (adjust as needed)

      return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Empty dependency array to run only on mount


     const logout = () => {
        setActive(false);
        Cookies.remove("token");
    };


  return (
    <section
      className={`w-[70vw] z-50 lg:w-[20vw] md:w-[40%] bg-sky-900 h-screen p-5 flex flex-col justify-between shadow-md shadow-gray-300 xl:relative text-white absolute xl:translate-x-0 ${
        !inView && "-translate-x-[200%] transition-all"
      }`}
    >
        <div className='flex flex-col gap-16'>
          <div className="w-full h-[65px] flex gap-2 text-white">
            <div className="w-[25%] h-full bg-gray-100 overflow-hidden rounded-full relative border-2 border-gray-300">
              {user && user.image ? (
                <img
                  alt="Profile Image"
                  src={user.image || "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image alt="Profile Image" src={pp} fill className="object-cover" />
              )}
            </div>
            <div className="flex flex-col justify-evenly">
              {true && (
                <>
                  <span className="font-semibold tracking-wide text-sm flex items-center gap-2">
                      { user?.last_name } { user?.first_name }
                  </span>
                  <span className="text-sm">{ user?.email }</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm">
        {navs.map((nav: Navs, index: number) => (
          <Link
            key={index}
            onClick={onSlideIn}
            href={nav.ref}
            className={`${
              pathName === nav.ref ? "bg-white text-sky-700" : ""
            } flex items-center gap-3 px-2 py-3 rounded-lg`}
          >
            <nav.icon className="text-lg" />
            {nav.name}
          </Link>
        ))}
          </div>
        </div>

       <button onClick={logout} className="flex items-center gap-3 px-2 text-sm cursor-pointer">
          <IoLogOutOutline className="text-lg" />
          <span>Logout</span>
        </button>
    </section>
  )
}
