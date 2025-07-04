"use client";
import React, { useContext, useEffect, useState } from 'react';
import { SiGoogleforms } from 'react-icons/si';
import { Issue, Tenant, User } from '../tenantContext';
import { usePostIssueMutation, useUpdateIssueMutation } from '@/app/api/issues';
import { toast, ToastContainer } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import Loading from '@/components/isloading';
import { issuesType } from '@/app/types';
import { ImSpinner9 } from 'react-icons/im';


// Type guard to check if error is FetchBaseQueryError
const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return (error as FetchBaseQueryError).status !== undefined;
};

// Type for error.data (adjust based on your backend response)
type ErrorData = {
  message?: string;
};

const categories = [
  {
    label: "Plumbing",
    issues: [
      "Leaking pipes",
      "Broken taps or showers",
      "Clogged drains",
      "Water pressure issues",
    ],
  },
  {
    label: "Electrical",
    issues: [
      "Power outages",
      "Faulty switches or sockets",
      "Lighting problems",
      "Meter complaints",
    ],
  },
  {
    label: "Appliance Issues",
    issues: [
      "Air conditioning/fan not working",
      "Water heater malfunction",
      "Provided kitchen appliance breakdown (if furnished)",
    ],
  },
  {
    label: "Structural",
    issues: [
      "Wall cracks",
      "Roof leaks",
      "Broken doors/windows",
      "Damaged tiles or flooring",
    ],
  },
  {
    label: "Sanitation & Waste",
    issues: [
      "Blocked sewage",
      "Waste bin complaints",
      "Pest control request",
    ],
  },
  {
    label: "Security",
    issues: [
      "Faulty locks",
      "Gate access issues",
      "Broken surveillance/CCTV (if available)",
    ],
  },
  {
    label: "Internet/Connectivity",
    issues: [
      "Wi-Fi or intercom malfunction (for smart estates)",
      "TV/cable issues (if managed)",
    ],
  },
  {
    label: "Cleaning & Groundskeeping",
    issues: [
      "Dirty common areas",
      "Uncut grass",
      "Overflowing dustbins",
    ],
  },
];

export default function Request() {
  const [category, setCategory] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, { isLoading: statusLoading }]=useUpdateIssueMutation();  const tenant = useContext(Tenant);
  const [submitData, {isLoading, isError, error}] = usePostIssueMutation();
  const myIssues: issuesType[] | null = useContext(Issue)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setIssue('');
  };

  console.log(myIssues)

   useEffect(() => {
          if (isError && error) {
            if (isFetchBaseQueryError(error)) {
              const errorData = error.data as ErrorData | undefined;
              toast.error(errorData?.message, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                theme: "dark",
                });
            } else {
              console.log('myError:', 'Serialized error occurred');
            }
          }
  
    }, [isError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const issues = {
        user: tenant?.user.id,
        agent: tenant?.acquiredProperty.agent.id,
        property: tenant?.acquiredProperty.id,
        category,
        issue,
        description
    }

    try{
      const res = await submitData(issues).unwrap();
      if(res){
        toast.success("Request sent", {
                                      position: "top-center",
                                      autoClose: 5000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      theme: "dark",
                      });
      }
    }catch(err){
      console.error(err)
    }
  };

const handleStatus = async (e: React.MouseEvent<HTMLButtonElement>, data: string, id: string) => {
  e.preventDefault();
  try{
    const res = await submitStatus({id,data: {status: data.toLowerCase() === 'pending' ? 'solved' : 'pending'}}).unwrap();
    toast.success(`Request updated to ${data.toLowerCase() === 'pending' ? 'solved' : 'pending'}`, {
                                      position: "top-center",
                                      autoClose: 5000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      theme: "dark",
                      });
  }catch(err){
    console.error(err)
  }
};

  const selectedCategory = categories.find(cat => cat.label === category);

  return (
    <section className="rounded-lg py-6 flex flex-col lg:flex-row justify-between gap-10">
      <ToastContainer />

      {/* Maintenance Form */}
      <div className="w-full lg:w-[40%]">
        <h2 className="text-2xl font-bold mb-4">Maintenance Request Form</h2>
        {submitted ? (
          <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
            Request submitted! We will attend to your issue soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            {category && (
              <div>
                <label className="block font-medium mb-1">Issue</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  required
                >
                  <option value="">Select issue</option>
                  {selectedCategory?.issues.map((iss) => (
                    <option key={iss} value={iss}>
                      {iss}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block font-medium mb-1">Description (optional)</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={8}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-700 flex justify-center text-white py-2 rounded font-semibold hover:bg-sky-600 transition"
            >
              {isLoading ? <Loading /> : 'Submit Request' }
            </button>
          </form>
        )}
      </div>

      {/* Maintenance History */}
      <div className="w-full lg:w-[60%] bg-white shadow-2xl shadow-gray-300 rounded-2xl relative mt-10 lg:mt-0">
        <div className="text-6xl bg-white text-gray-400 w-fit p-5 rounded-full absolute -top-10 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-top-[15%] lg:right-0 shadow-xl shadow-gray-100">
          <SiGoogleforms />
        </div>

        <div className="p-4 sm:p-5 mt-16 space-y-3">
          <h2 className="text-xl font-semibold">Maintenance History</h2>

          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden text-sm min-w-[400px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-3 text-left">#</th>
                  <th className="py-2 px-3 text-left">Issue</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myIssues && myIssues.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`
                      text-xs
                      ${idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}
                      hover:bg-gray-100 transition-colors
                    `}
                  >
                    <td className="py-2 px-3">{idx + 1}</td>
                    <td className="py-2 px-3">{row.issue}</td>
                    <td className="py-2 px-3">
                      {row.createdAt
                        ? new Date(row.createdAt).toDateString()
                        : 'N/A'}
                    </td>
                    <td className={`py-2 px-3 text-[10px] font-bold`}>
                      <span className={` w-fit p-1 rounded ${row.status.toLocaleLowerCase() === 'pending' ? 'text-red-400' : 'text-green-600'}`}>{row.status}</span>
                    </td>
                    <td>
                      <button onClick={(e) => handleStatus(e, row.status, row._id)} className={`cursor-pointer w-full flex justify-center ${row.status.toLocaleLowerCase() === 'pending' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'} text-white p-1 text-[10px] rounded `}>
                        
                        {statusLoading ?  <ImSpinner9 className='animate-spin text-white text-sm' /> : row.status.toLocaleLowerCase() === 'pending' ? 'Set to solved' : 'Set to pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}