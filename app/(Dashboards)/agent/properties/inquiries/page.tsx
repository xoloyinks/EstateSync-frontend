"use client";
import React, { useContext, useEffect, useState } from "react";
import { useApproveApplicationMutation, useGetApplicationsQuery, useRejectApplicationMutation } from "@/app/api/general";
import { ApplicationsType, userType } from "@/app/types";
import { User } from "../../agentContext";
import { FiCheck, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import Loading from "@/components/isloading";

interface RequestType {
  property: string;
  location: string;
  clients: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: string;
    code: string;
    proof: string;
    createdAt?: Date;
    payment?: string;
  }[];
}

export default function Inquiries() {
  const [search, setSearch] = useState("");
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const { data: applications, isLoading, error } = useGetApplicationsQuery(null);
  const [updateApplicationStatus, { isLoading: approveLoading }] = useApproveApplicationMutation();
  const [ rejectApplication, { isLoading: rejectLoading } ] = useRejectApplicationMutation()
  const user: userType | undefined = useContext(User);

  useEffect(() => {
    if (!applications?.data || !user?.id) return;

    const filtered = applications.data.filter(
      (app: ApplicationsType) => app.property.agent.id === user.id
    );

    const grouped = filtered.reduce((acc: Record<string, RequestType>, app: ApplicationsType) => {
      const key = app.property.title;

      if (!acc[key]) {
        acc[key] = {
          property: app.property.title,
          location: app.property.location,
          clients: [],
        };
      }

      acc[key].clients.push({
        id: app.user.id || app.user.email,
        name: `${app.user.first_name} ${app.user.last_name}`.trim(),
        email: app.user.email,
        avatar: app.user.image || "/default-avatar.png",
        status: app.status.toLowerCase(),
        code: app.code,
        proof: app.proof,
        createdAt: new Date(app.createdAt),
      });

      return acc;
    }, {});

    setRequests(Object.values(grouped));
  }, [applications, user?.id]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setModalImg(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const filteredRequests = requests.filter((r) =>
    r.property.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatus = async (status: "approved" | "rejected", id: string) => {
      let res
      try {
        if(status === 'approved'){
          res = await updateApplicationStatus({ id, status }).unwrap();
        }else{
          res = await rejectApplication({id, status}).unwrap()
        }
        
        if(res){
          toast.success(`Application ${status} successfully!`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
          });
        }
      }catch (error) {
        toast.error(`Application update failed!`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
          });
        console.error("Error updating status:", error);
      }
  }

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Client Inquiries
        </h2>
        <input
          type="search"
          placeholder="Search by property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-xl shadow-md bg-white border border-gray-200 focus:ring-2 focus:ring-sky-600 outline-none"
        />
      </div>

      {/* States */}
      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error loading inquiries.</p>}
      {!isLoading && !error && filteredRequests.length === 0 && (
        <p className="text-center text-gray-400">No inquiries found.</p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRequests.map((prop, propIdx) => (
          <div
            key={propIdx}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl relative"
          >
            <h3 className="text-xl font-bold mb-1">{prop.property}</h3>
            <p className="text-sm text-gray-500 mb-2">{prop.location}</p>
            <span className="text-sm text-gray-700 font-medium mb-4 block">
              {prop.clients.length} Client{prop.clients.length > 1 ? "s" : ""}
            </span>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto mt-3">
              {prop.clients.map((client) => (
                <div
                  key={client.id}
                  className="flex justify-between items-center py-4 gap-4"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setModalImg(client.avatar)}
                  >
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover shadow border"
                    />
                    <div>
                      <p className="font-semibold">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                      <p className="text-[11px] text-gray-400">
                        {client.createdAt?.toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Code:</span> {client.code}
                      </p>
                      <p>
                        <a href={client.proof} target="_blank" className="text-xs font-bold text-blue-500 hover:text-blue-600">
                          Download Proof of finance
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {client.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleStatus("approved", client.code)}
                          disabled={approveLoading}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-full shadow hover:bg-green-700 w-26"
                        >
                          {approveLoading ?
                              <Loading /> : 
                            <>
                              <FiCheck />
                              Approve
                            </>
                          }
                          
                        </button>
                        <button
                          disabled={rejectLoading}
                          onClick={() => handleStatus("rejected", client.code)}
                          className="flex items-center w-26 justify-center gap-1 px-3 py-1.5 border border-red-600 text-red-600 text-sm rounded-full hover:bg-red-50"
                        >
                          {
                            rejectLoading ? <Loading /> : 
                            <>
                              <FiX />
                              Reject
                            </>
                          }
                        </button>
                      </>
                    ) : (
                      <div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                client.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {client.status}
                              
                            </span>
                            <span className={`bg-`}>
                              {client.payment === "paid"
                                ? <span className="text-green-600 font-semibold">Payment: Paid</span>
                                : <span className="text-red-600 font-semibold">Payment: Pending</span>
                              }
                            </span>
                            { client.status !== 'rejected' && 
                                <button 
                                  disabled={rejectLoading}
                                  onClick={() => handleStatus("rejected", client.code)}
                                className="bg-red-500 text-white flex justify-center rounded-full w-26 text-xs p-2 hover:bg-red-600 cursor-pointer">
                                  {
                                    rejectLoading ? <Loading />
                                    : "Disapprove"
                                  }
                                  
                                </button>
                              }
                      </div>
                      
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setModalImg(null)}
        >
          <div
            className="bg-white rounded-xl p-4 shadow-2xl max-w-xs w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImg}
              alt="Client Avatar"
              className="w-full h-auto object-contain rounded-lg"
            />
            <button
              onClick={() => setModalImg(null)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
