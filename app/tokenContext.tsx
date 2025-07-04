"use client"
import React, { useEffect, useState } from "react"
import { createContext } from "react"
import Cookies from "js-cookie"




export default function Token({ children }: {
    children: React.ReactNode,
}): React.ReactNode{
    const [active, setActive] = useState<boolean | null>(null);
    
    
    useEffect(() => {
        const userToken = Cookies.get('token');
        if(userToken){
            setActive(userToken ? true : false)
        }
    }, [])
    
   return(
        <>
            <UserData.Provider value={[active, setActive]}>
                {children}
            </UserData.Provider>
        </>
   )
}

export const UserData = createContext<[boolean | null, React.Dispatch<React.SetStateAction<boolean | null>>]>([null, () => {}]);