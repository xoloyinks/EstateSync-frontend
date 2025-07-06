"use client";
import React, { useContext, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { UserData } from "../tokenContext";

export default function Payment() {
  const router = useRouter();
  const [active, setActive] = useContext(UserData);

  // Optionally, you can redirect after a few seconds
  useEffect(() => {
      if(active === undefined){
        router.push("/");
      }

    const timer = setTimeout(() => {
      router.push("/tenant");
    }
    , 5000); // Redirect after 5 seconds
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [active]);

console.log(setActive)
  return (
   <>
        <Nav />
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Payment Successful!</h1>
            <p className="text-gray-600 mb-6 text-center">
              Thank you for your payment. Your transaction was successful.<br />
              You will be redirected shortly.
            </p>
            <button
              onClick={() => router.push("/tenant")}
              className="mt-2 px-6 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
    <Footer />
   </>
  );
}