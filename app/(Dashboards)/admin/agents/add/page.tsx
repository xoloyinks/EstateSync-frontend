"use client";
import React, { useContext, useRef, useState, useCallback } from "react";
import { Property } from "../../adminContext";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import Loading from "@/components/isloading";
import { PropertyType } from "@/app/types";

interface FormData {
  image: File | null;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  properties: string[];
  phone_number: string;
  gender: string;
}

export default function AddAgent() {
  const properties: PropertyType[] | null = useContext(Property);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    image: null,
    imageUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    properties: [],
    phone_number: "",
    gender: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized handlers for better performance
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (form.imageUrl) URL.revokeObjectURL(form.imageUrl);
        setForm((prev) => ({
          ...prev,
          image: file,
          imageUrl: URL.createObjectURL(file),
        }));
      }
    },
    [form.imageUrl]
  );

  const handlePropertyChange = useCallback(
    (propId: string, checked: boolean) => {
      setForm((prev) => ({
        ...prev,
        properties: checked
          ? [...prev.properties, propId]
          : prev.properties.filter((id) => id !== propId),
      }));
    },
    []
  );

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(!form.imageUrl){
        toast.error('Image is required', {
           position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        })
        return;
      }
      let token = Cookies.get("token")?.trim();
      if (token) {
        token = token.replace(/^"|"$/g, "");
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!form.firstName || !form.lastName || !form.email || !form.password || !form.gender || !form.phone_number) {
        toast.error("Please fill all required fields", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        return;
      }

      const formData = new FormData();
      formData.append("first_name", form.firstName);
      formData.append("last_name", form.lastName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.image) formData.append("image", form.image);
      formData.append("properties", JSON.stringify(form.properties));
      formData.append("role", "agent");
      formData.append("phone_number", form.phone_number);
      formData.append("gender", form.gender);

      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/agents/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          console.log(res)
          throw new Error(`HTTP error! status: ${res.status}`);
        }


        toast.success("Agent added successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        // Reset form
        setForm({
          image: null,
          imageUrl: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          properties: [],
          phone_number: "",
          gender: "",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Error adding agent:", error);
         let errorMessage = "An error occurred";
        if (
          error &&
          typeof error === "object" &&
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data &&
          typeof error.data.message === "string"
        ) {
          errorMessage = error.data.message;
        }
        toast.error(`${errorMessage}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <section className="w-full max-w-lg mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <ToastContainer />
        <h2 className="text-3xl font-bold text-sky-900 text-center mb-8 tracking-tight">
          Add New Agent
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div
              className="w-24 h-24 rounded-full bg-sky-50 border-2 border-sky-300 flex items-center justify-center overflow-hidden cursor-pointer mb-3 hover:opacity-90 transition-opacity"
              onClick={handleImageClick}
              title="Upload Image"
              role="button"
              aria-label="Upload agent image"
            >
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Agent preview"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              ) : (
                <span className="text-sky-500 text-4xl font-bold">+</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              aria-label="Agent image upload"
            />
            <span className="text-xs text-gray-500">Click to upload agent image</span>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400"
                placeholder="First Name"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400"
                placeholder="Last Name"
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400"
              placeholder="Email"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone_number"
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400"
              placeholder="Phone Number"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400"
              aria-required="true"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400"
              placeholder="Password"
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign Properties
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
              {properties && properties?.length > 0 ? (
                properties.map((prop: PropertyType, index:number) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer py-1 hover:text-sky-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="properties"
                      checked={form.properties.includes(prop.id)}
                      onChange={(e) => handlePropertyChange(prop.id, e.target.checked)}
                      className="accent-sky-600 h-4 w-4"
                      aria-label={`Assign property ${prop.title}`}
                    />
                    <span className="truncate">{prop.title}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No properties available</p>
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              Select one or more properties
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-600 to-sky-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-sky-700 hover:to-sky-600 transition-transform transform hover:scale-105 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loading /> : "Add Agent"}
          </button>
        </form>
      </div>
    </section>
  );
}