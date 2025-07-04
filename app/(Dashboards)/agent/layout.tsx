"use client";
import { useContext, useEffect, useState } from "react";
import { UserData } from "../../tokenContext";
import { FaAccusoft, FaTimes } from "react-icons/fa";
import { RiMenuFold4Line } from "react-icons/ri";
import Link from "next/link";
import AgentNav from "@/components/agentNav";
import AgentData from "./agentContext";


export default function ManagementLayout({children}: Readonly<{children: React.ReactNode;}>) {
    const [active] = useContext(UserData)
    const [inView, setInview] = useState(false);
    const toggleView = () => {
        setInview(prev => !prev)
    }
    // console.log("Status: ", active)

    useEffect(() => {
                if (active === undefined) {
                    return; 
                }
                if(active === false){
                    window.location.href = ('/login');
                }
            }
        , [active]);
    return(
        <AgentData>
            <section  className={`h-screen overflow-hidden flex w-full` }>
                <AgentNav inView={inView} onSlideIn={toggleView}  />
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
        </AgentData>
    )
}