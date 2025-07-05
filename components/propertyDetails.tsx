"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";
import { FaCaretLeft, FaCopy } from "react-icons/fa6";
import Cookies from "js-cookie";
import { TbCurrencyNaira } from "react-icons/tb";
import { PropertyType, userType } from "@/app/types";
import Loading from "./isloading";
import { toast, ToastContainer } from "react-toastify";

const pp = "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png";

export default function PropertyDetails() {
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [property, setProperty] = useState<PropertyType>();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [financialProof, setFinancialProof] = useState<File | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const x = Cookies.get("user");
  let user: userType | undefined;
  let role: string | undefined;

  if (x) {
    user = JSON.parse(x);
    role = user?.role;
  }

  useEffect(() => {
    const propertyStringObject: string | undefined = Cookies.get("Property");
    if (typeof propertyStringObject === "string") {
      setProperty(JSON.parse(propertyStringObject));
    }
  }, []);

  // Handle copying application ID to clipboard
  const handleCopy = () => {
    if (applicationId) {
      navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  let token = Cookies.get("token")?.trim();
       if(token){
          token = token.replace(/^"|"$/g, "");
  }
  // Handle form submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialProof) {
      setError("Please upload a PDF or DOCX file for financial proof.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("id", user?.id || '');
    formData.append("status", "Pending");
    formData.append("email", user?.email || '');
    formData.append("image", financialProof);
    formData.append("property", property?.id || '')
    formData.append("agent", property?.agent.id || '')

    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      // Replace with your actual backend endpoint
      const response = await fetch(`${base}/applications`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(data){
        setApplicationId(data.data);
        toast.success('Application submitted!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark"
        });
      }
    } catch(err){
      console.error("Error submitting application:", err);
      setError("An error occurred while submitting your application.");
      toast.error('Error occured!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    }finally{
      setIsSubmitting(false);
    }
  };

  // Handle file input change with PDF/DOCX validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(file.type)) {
        setFinancialProof(file);
        setError(null);
      } else {
        setFinancialProof(null);
        setError("Please upload a valid PDF or DOCX file.");
      }
    }
  };
  if(property?.acquired){
    console.log('Yes');
  }else{
    console.log('No')
  }
  return (
    <section className="w-full px-2 sm:px-6">
      <ToastContainer />
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 text-gray-500 hover:text-black mb-4"
      >
        <FaCaretLeft /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8 mt-6 text-sm">
        {/* Left/Main Content */}
        <div className="lg:border-r border-gray-400 lg:w-[60%] pr-0 lg:pr-4 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold">{property?.title}</h2>
          <div className="w-full h-[220px] sm:h-[300px]">
            <Swiper
              spaceBetween={0}
              modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
              slidesPerView={1.1}
              breakpoints={{
                640: { slidesPerView: 1.3 },
                1024: { slidesPerView: 1.3 },
              }}
              centeredSlides
              effect="coverflow"
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet custom-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
              }}
              speed={500}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
              }}
              className="w-full h-full"
            >
              {property?.images.map((el, i) => (
                <SwiperSlide key={i} className="w-full h-full relative cursor-pointer">
                  <Image
                    src={el}
                    alt={`Slide ${i}`}
                    fill
                    className="object-cover"
                    onClick={() => setModalImg(el)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-semibold mt-4">Description</h3>
            <p className="text-graystatData-gray-700">{property?.description}</p>
          </div>
          <div className="flex not-sm:flex-col not-sm:gap-5 bg-white justify-evenly py-5 sm:py-10 rounded-xl shadow-2xl px-3 shadow-gray-400 text-xs">
            <div>
              <h3 className="text-sm font-semibold">Price</h3>
              <p className="text-gray-700 flex items-center">
                <TbCurrencyNaira /> {property?.price}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Location</h3>
              <p className="text-gray-700">{property?.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Bedrooms</h3>
              <p className="text-gray-700">{property?.bedrooms}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Mode</h3>
              <p className="text-gray-700">{property?.mode}</p>
            </div>
          </div>
        </div>

        {/* Client/Agent Information */}
        <div className="w-full lg:w-[40%] flex flex-col items-center">
          <h3 className="text-md font-semibold mt-4">
            {role === "tenant" || role === "visitor" ? "Agent Information" : role === "agent" && property?.acquired ? "Tenant Information" : "Property still available"}
          </h3>
          <div className="flex flex-col gap-4 mt-2 items-center">
            {role &&  (
              <>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <img
                    src={role === 'tenant' ? property?.agent.image || pp : role === 'agent' && property?.acquired ? property.acquired.image || pp : property?.agent.image || pp }
                    alt="Image"
                    onClick={() => setModalImg(role === 'tenant' || role === 'admin'  ? property?.agent.image || pp : role === 'agent' && property?.acquired ? property.acquired.image || pp : pp )}
                    className="rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200 w-full h-full"
                  />
                </div>
                <div className="text-center space-y-3">
                  <p className="font-semibold text-gray-800">
                    {role === 'tenant' || role === 'admin' || role === 'visitor' ? property?.agent.last_name + ' ' + property?.agent.first_name : role === 'agent' && property?.acquired ? property.acquired.last_name + " " + property.acquired.first_name : '' }
                  </p>
                  <p className="text-gray-600">{role === 'agent' ? property?.acquired?.email : role === 'visitor' || role === 'tenant' || 'admin' ? property?.agent.email : '' }</p>
                  <p className="text-gray-600">{role === 'agent' ? property?.acquired?.phone_number : role === 'visitor' || role === 'tenant' || 'admin' ? property?.agent.phone_number : '' }</p>
                </div>
              </>
            )}
            {role === undefined ? (
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl">Please sign in</h2>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-5 cursor-pointer py-2 bg-black text-white text-sm rounded"
                >
                  Sign in
                </button>
              </div>
            ) : role === "visitor" ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-10 py-2 cursor-pointer bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
              >
                {property?.mode.toLowerCase() === "for rent" ? "Apply for Acquisition" : "Buy Property"}
              </button>
            ) : role === "tenant" ? (
              <p className="bg-black opacity-50 text-white py-2 px-10 rounded">
                You currently occupy a property
              </p>
            ) : role === 'agent' && !property?.acquired ? '' :
            (
              <button className="px-5 py-2 bg-sky-700 text-white text-sm rounded">Message</button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Image View */}
      {modalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setModalImg(null)}
        >
          <div className="relative w-[90vw] max-w-4xl h-[85vh] transition-opacity duration-300">
            <Image
              src={modalImg}
              alt="Enlarged"
              fill
              className="object-contain rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 bg-white/90 rounded-full px-4 py-2 text-black font-bold text-xl hover:bg-white transition-colors"
              onClick={() => setModalImg(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal for Application Confirmation */}
      {
        showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-[90vw] max-w-md shadow-2xl transition-transform duration-300">
              {applicationId ? (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-green-600">Application Submitted!</h3>
                  <p className="text-gray-700">
                    Your application has been submitted successfully. Your application ID is:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-bold text-black">{applicationId}</p>
                    <button
                      onClick={handleCopy}
                      className="text-gray-500 hover:text-black transition-colors"
                      title={copied ? "Copied!" : "Copy Application ID"}
                    >
                      <FaCopy className="text-lg" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600">Copied to clipboard!</p>
                  )}
                  <p className="text-gray-600">
                    {/* You will receive an email confirmation soon. */}
                     Check your application status{" "}
                    <a href="/status" className="text-blue-600 hover:underline">
                      here
                    </a>.
                  </p>
                  <button
                    onClick={() => {
                      setShowApplyModal(false);
                      setApplicationId(null);
                      setFinancialProof(null);
                      setCopied(false);
                    }}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <h3 className="text-xl font-semibold">Confirm Application Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={user?.first_name || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={user?.last_name || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={user?.phone_number || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Financial Proof (PDF or DOCX) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    {financialProof && (
                      <p className="text-sm text-gray-600 mt-1">Selected: {financialProof.name}</p>
                    )}
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 bg-black w-44 text-white rounded hover:bg-gray-800 flex justify-center transition-colors ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? <Loading /> : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )
      }
    </section>
  );
}