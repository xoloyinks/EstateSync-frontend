"use client";
import { useEffect, useState } from "react";
import { FaAccusoft, FaTimes } from "react-icons/fa";
import { RiMenuFold4Line } from "react-icons/ri";
import Link from "next/link";
import AdminNav from "@/components/adminNav";
import Cookies from "js-cookie";
import { userType } from "@/app/types"
import AdminData from "./adminContext";


export default function ManagementLayout({children}: Readonly<{children: React.ReactNode;}>) {
    const [inView, setInview] = useState(false);
    const [cookieUser, setCookieUser] = useState<string | undefined>(Cookies.get('user'));
    const [user, setUser] = useState<userType | undefined>(undefined);

    const toggleView = () => {
        setInview(prev => !prev)
    }

     useEffect(() => {
        const interval = setInterval(() => {
            const currentCookie = Cookies.get('user');
            setCookieUser(prev => (prev !== currentCookie ? currentCookie : prev));
        }, 1000); // check every second

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (cookieUser) {
            try {
                setUser(JSON.parse(cookieUser) as userType);
            } catch {
                setUser(undefined);
            }
        } else {
            setUser(undefined);
        }
    }, [cookieUser]);

    // useEffect(() => {
    //     if (active === undefined) {
    //         return; 
    //     }
    //     if(active === false || active === null ){
    //         window.location.href = '/login';
    //     }
    // }, [active]);
    return(
        <AdminData>
            <section  className={`h-screen overflow-hidden flex w-full` }>
                <AdminNav inView={inView} onSlideIn={toggleView} user={user}  />
                <section className='w-[100vw] xl:w-[80vw] h-screen overflow-y-scroll bg-gray-100 px-5 sm:px-10 py-5'>
                    <button onClick={toggleView} className='xl:hidden  bg-white text-3xl z-50 absolute right-8 shadow-md p-3 rounded-md '>
                        {inView ? <FaTimes /> : <RiMenuFold4Line />}
                    </button>
                        <Link href={'/'} className="flex gap-2 items-center mb-10 w-fit">
                            <span><FaAccusoft className='text-5xl text-sky-700' /></span>
                            <span className="text-xl font-semibold ">EstateSync</span>
                        </Link>
                        {children}
                </section>
            </section>
        </AdminData>

    )
}