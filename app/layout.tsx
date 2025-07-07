"use client"
import { Montserrat } from "next/font/google";
import "./globals.css";
import {store} from "@/app/api/store";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import Token from "./tokenContext";
const montserrat = Montserrat({
  subsets: ['vietnamese'],
  weight: ['400', '700'], 
  display: 'swap',
});

// console.log = () => {};
// console.info = () => {};
// console.warn = () => {};
// console.error=()=>{};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hydration fix: Only render children after mount
  const [mounted, setMounted] = useState(false);

  console.log(mounted)

  useEffect(() => {
    setMounted(true);
     if(typeof window !== 'undefined'){
          return
        }
    
  }, []);

  
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} __className_409de3`}
      >
        <Provider store={store}>
          <Token>
            {children}
          </Token>
        </Provider>
      </body>
    </html>
  );
}
