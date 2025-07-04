"use client";
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { agent, Agent, user } from '@/app/(Dashboards)/admin/adminContext';
import { useGetPropertyQuery } from '@/app/api/properties';
import Loading from '@/components/isloading';

export type Property = {
  title: string;
  description: string;
  price: string;
  location: string;
  agent: user;
  mode: string;
  bedrooms: string;
  createdAt: Date;
  __v: number;
  images: string[];
  _id: string;
  acquired?: string
};

const AgentProperties = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetPropertyQuery(id);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (data) {
      setProperty(data.data);
    }
  }, [data]);

  return (
    <li className="text-gray-600 transition-colors">
      {isLoading && <Loading />}
      {property && (
        // <Link href={`/properties/${property._id}`} className="block truncate">
          property.title
        // </Link>
      )}
    </li>
  );
};

export default function Agents() {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const agents: agent[] | null = useContext(Agent);

  const handleImageClick = (img: string) => setModalImage(img);
  const handleCloseModal = () => setModalImage(null);

  const filteredAgents: agent[] | null =
    agents?.filter((agent: agent) => {
      const q = search.toLowerCase();
      return (
        agent.user.first_name.toLowerCase().includes(q) ||
        agent.user.last_name.toLowerCase().includes(q) ||
        agent.user.email.toLowerCase().includes(q) ||
        agent.assignedProperties.some((prop) => prop.toLowerCase().includes(q))
      );
    }) ?? [];

  return (
    <section className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-sky-900 tracking-tight">Our Agents</h2>
        <Link
          href="/admin/agents/add"
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          + Add Agent
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or property..."
          className="w-full sm:w-96 px-5 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400 text-gray-700"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 text-lg">
            No agents found.
          </div>
        ) : (
          filteredAgents.map((agent) => (
            <div
              key={agent._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Agent Info */}
              <div className="flex items-center gap-4">
                <img
                  src={agent.user.image}
                  alt={`${agent.user.first_name} ${agent.user.last_name}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-sky-300 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(agent.user.image)}
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {agent.user.first_name} {agent.user.last_name}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">{agent.user.email}</p>
                </div>
              </div>

              {/* Properties Managed */}
              <div>
                <h4 className="font-semibold text-sky-700 text-sm mb-2">Properties Managed</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 max-h-24 overflow-y-auto">
                  {agent.assignedProperties.map((prop, idx) => (
                    <AgentProperties id={prop} key={idx} />
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="mt-auto bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full font-semibold shadow-sm transition-transform transform hover:scale-105">
                Message Agent
              </button>
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-white rounded-lg p-3 max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt="Agent"
              className="max-w-full max-h-[80vh] rounded-md object-contain"
            />
            <button
              onClick={handleCloseModal}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg transition"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}