"use client";
import React, { useEffect, useState, useCallback } from "react";
import { FaCaretLeft, FaNairaSign } from "react-icons/fa6";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { useGetApplicationQuery, useSubscribeMutation } from "../api/general";
import { PropertyType, userType } from "../types";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

export default function CheckStatus(){
  const [input, setInput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [statusData, setStatusData] = useState<{
    _id: string;
    user: userType;
    property: PropertyType;
    proof: string;
    status: string;
    code: string;
    createdAt: Date;
  } | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentGenerated, setPaymentGenerated] = useState(false);

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user") || "") : null;

  const { data, isLoading: loading, error: queryError } = useGetApplicationQuery(code, {
    skip: !code,
  });

  const [subscribe] = useSubscribeMutation();

const [hasGeneratedUrl, setHasGeneratedUrl] = useState(false);

useEffect(() => {
  const generatePaymentUrl = async () => {
    if (!data || !user || hasGeneratedUrl) return;

    const userIdFromData = data?.data?.user?.id;
    const property = data?.data?.property;

    if (userIdFromData !== user.id) {
      setStatusData(null);
      setError("You are not authorized to view this application.");
      toast.error("You are not authorized to view this application!", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }

    try {
      const subData = {
        amount: Number(property?.price),
        email: user.email,
        planCode: property?.planCode,
      };

      const res = await subscribe(subData).unwrap();
      if (res) {
        setPaymentGenerated(true);
        setPaymentUrl(res.data.authorization_url)
      }

      setError(null);
      setStatusData(data.data);
      setHasGeneratedUrl(true); 
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Subscription failed. Please try again.", {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  if(!hasGeneratedUrl){
    generatePaymentUrl();
  }

}, [data, user, hasGeneratedUrl]);

useEffect(() => {
  if(queryError) {
    setError("Failed to fetch application data. Please check the application ID.");
    toast.error("Failed to fetch application data!", {
      position: "top-center",
      theme: "dark",
    });
  }
}, [queryError]);

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter an application ID or email.");
      return;
    }
    setCode(input.trim());
  };

  return (
    <>
      <Nav />
      <ToastContainer />
      <section className="w-full pt-24 px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-gray-500 hover:text-black mb-6 transition-colors"
          >
            <FaCaretLeft className="text-lg" /> Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Check Application Status
          </h1>

          <form
            onSubmit={handleCheckStatus}
            className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6"
          >
            <div className="mb-4">
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Application ID or Email
              </label>
              <input
                type="text"
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your application ID or email (e.g., HOU1234)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </form>

          {statusData && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Application Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={statusData.property.images[0] || ""}
                      alt="Property Image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Property:{" "}
                      <span className="font-semibold">{statusData.property.title}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Application ID:{" "}
                      <span className="font-semibold">{statusData.code}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-semibold p-1 text-xs rounded text-white ${
                        statusData.status.toLowerCase() === "approved"
                          ? "bg-green-600"
                          : statusData.status.toLowerCase() === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {statusData.status.toUpperCase()}
                    </span>
                  </p>
                  {statusData.status.toLowerCase() === "approved" && paymentUrl && (
                    <p className="py-3 text-sm w-fit">
                      <a
                        href={paymentUrl}
                        target="_blank"
                        className="text-blue-500 font-bold hover:text-blue-600 flex items-center gap-1"
                      >
                        Proceed to Make payment of{" "}
                        <FaNairaSign />{Number(statusData.property.price).toLocaleString()}
                      </a>
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Submitted:{" "}
                    <span className="font-semibold">
                      {new Date(statusData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {statusData.status === "approved"
                    ? "Your application has been approved! Please proceed to make payment."
                    : statusData.status === "rejected"
                    ? "Your application was not approved. Contact the agent for more details."
                    : "Your application is under review. You will be notified soon."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
