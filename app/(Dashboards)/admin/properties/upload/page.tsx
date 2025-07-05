"use client";
import Input from '@/components/input';
import Loading from '@/components/isloading';
import React, { useState, useRef, useContext } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { toast, ToastContainer } from 'react-toastify';
import { User } from '../../adminContext';
import Cookies from 'js-cookie'


const MODES = ['For Sale', 'For Rent'];

export default function UploadProperty() {
  const user = useContext(User);
  const [loading, setLoading] = useState(false)
  let email: string;
  if(user){
    email = user.email;
  }
  const [form, setForm] = useState({
    images: [] as File[],
    location: '',
    agentEmail: '',
    title: '',
    description: '',
    bedrooms: '',
    price: '',
    mode: MODES[1],
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputKey, setInputKey] = useState(0);

  // Modal state
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleChange = (target: { name: string; value: string }) => {
    const { name, value } = target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(files as FileList)],
      }));
      setInputKey(prev => prev + 1);
    }
  }

  const handleRemoveImage = (idx: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleAddMoreImages = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = (file: File) => {
    const url = URL.createObjectURL(file);
    setModalImage(url);
  };

  const handleCloseModal = () => {
    if (modalImage) URL.revokeObjectURL(modalImage);
    setModalImage(null);
  };

     let token = Cookies.get("token")?.trim();
     if(token){
        token = token.replace(/^"|"$/g, "");
     }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormData = new FormData();
    const backendUrl = process.env.NEXT_PUBLIC_NODE_ENV === "development" ?  process.env.NEXT_PUBLIC_BACKEND_URL : "https://estatesync-uhkn.onrender.com/api/";
    
    formData.append('title', form.title);
    formData.append('location', form.location);
    formData.append('price', form.price)
    formData.append('agent_email', form.agentEmail);
    formData.append('mode', form.mode);
    formData.append('admin_email', email)
    formData.append('bedrooms', form.bedrooms);
    formData.append('description', form.description)
    form.images.forEach((file) => {
      formData.append('images', file);
    });

    
     try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/properties/createProperty`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, 
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Profile updated successfully:', data);
      toast.success('Property Uploaded!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

    } catch (error) {
      console.error('Error uploading Property:', error);
      toast.error('Failed to uploading Property', {
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

  };

  return (
    <div className="w-full sm:w-[70%] mt-12">
      <ToastContainer />
      <h2 className="text-3xl font-extrabold mb-8 text-sky-700 text-left tracking-tight">Upload Property</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-bold mb-2 text-gray-700 text-lg">Property Images</label>
          <p className='mb-3 font-semibold text-xs'>{form.images.length} image(s) selected</p>
          <input
            key={inputKey}
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={handleAddMoreImages}
            className="mb-3 2 h-28 w-28 text-sky-700 bg-white items-center text-2xl flex justify-center rounded-lg font-semibold shadow hover:bg-gray-200 transition"
          >
            <FaPlus />
          </button>
          <div className="flex flex-wrap gap-4 mt-2">
            {form.images.length > 0 &&
              form.images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative w-32 h-32 border-2 border-sky-100 rounded-lg overflow-hidden group shadow">
                    <img
                      src={url}
                      alt={file.name}
                      className="object-cover w-full h-full cursor-pointer transition-transform duration-200 group-hover:scale-105"
                      onClick={() => handleImageClick(file)}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-base opacity-90 hover:opacity-100 shadow"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
        <Input
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Lekki, Lagos"
        />
        <Input
          label="Agent Email"
          name="agentEmail"
          value={form.agentEmail}
          onChange={handleChange}
          placeholder="e.g. agent@email.com"
          type="email"
        />
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Modern 2-bedroom apartment"
        />
        <div>
          <label className="text-sm font-semibold block mb-1" htmlFor="description">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={e => handleChange(e.target)}
            className="w-full border-b border-black py-2 focus:outline-none focus:placeholder:text-gray-200 placeholder:text-gray-300 rounded"
            placeholder="Describe the property"
            rows={3}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Bedrooms"
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            placeholder="e.g. 3"
            type="number"
          />
          <Input
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. ₦2,500,000/year"
            type="text"
          />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1" htmlFor="mode">Mode</label>
          <select
            name="mode"
            value={form.mode}
            onChange={e => handleChange(e.target)}
            className="w-full border-b border-black py-2 focus:outline-none rounded"
            required
          >
            {MODES.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-fit px-10 bg-gradient-to-r from-sky-700 to-sky-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-800 hover:to-sky-600 transition"
        >
          { loading ? <Loading /> : "Upload Property" }
        </button>
      </form>

      {/* Modal for image preview */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={handleCloseModal}
        >
          <div className="relative bg-white rounded-xl shadow-lg p-4" onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Preview" className="max-w-[90vw] max-h-[80vh] rounded-lg" />
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-2xl shadow"
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}