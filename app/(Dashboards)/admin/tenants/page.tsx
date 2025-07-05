"use client";
import React, { useContext, useState, useEffect } from 'react';
import { Tenant } from '../adminContext';
import Link from 'next/link';
import { tenantsType } from '@/app/types';

export default function Tenants() {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const data: tenantsType[] | null = useContext(Tenant);
  const tenantsPerPage = 20;

  const handleImageClick = (img: string) => setModalImage(img);
  const handleCloseModal = () => setModalImage(null);

  const filteredTenants: tenantsType[] =
    data?.filter((tenant: tenantsType) => {
      const q = search.toLowerCase();
      return (
        tenant.user.first_name.toLowerCase().includes(q) ||
        tenant.user.last_name.toLowerCase().includes(q) ||
        tenant.user.email.toLowerCase().includes(q) ||
        tenant.user.gender && tenant.user.gender.toLowerCase().includes(q) || 
        tenant.user.phone_number.toLowerCase().includes(q) ||
        tenant.acquiredProperty.title.toLowerCase().includes(q) ||
        tenant.status.toLowerCase().includes(q) ||
        tenant.acquiredProperty.agent.first_name.toLowerCase().includes(q) ||
        tenant.acquiredProperty.agent.last_name.toLowerCase().includes(q) ||
        tenant.acquiredProperty.agent.email.toLowerCase().includes(q)
      );
    }) ?? [];

  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);
  const paginatedTenants = filteredTenants.slice(
    (page - 1) * tenantsPerPage,
    page * tenantsPerPage
  );

  const no_image =
    "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png";

  // Reset to page 1 if search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <section className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-sky-900 tracking-tight">Tenants</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, gender, agent, status, or property..."
          className="w-full sm:w-96 px-5 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400 text-gray-700"
        />
      </div>

      {/* Tenant Count */}
      <p className="mb-6 text-gray-600 font-semibold">
        {filteredTenants.length} tenant{filteredTenants.length !== 1 ? 's' : ''}{' '}
        {search ? 'found' : ''}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-sky-50 text-sky-800 font-semibold">
            <tr>
              <th className="py-4 px-6 text-left">Image</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Phone</th>
              <th className="py-4 px-6 text-left">Gender</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Agent</th>
              <th className="py-4 px-6 text-left">Property</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTenants.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500 text-lg">
                  No tenants found.
                </td>
              </tr>
            ) : (
              paginatedTenants.map((tenant, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-sky-50 transition-colors last:border-b-0"
                >
                  <td className="py-4 px-6">
                    <img
                      src={tenant.user.image || no_image}
                      alt={`${tenant.user.first_name} ${tenant.user.last_name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-sky-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(tenant.user.image || no_image)}
                    />
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    {tenant.user.first_name} {tenant.user.last_name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{tenant.user.phone_number}</td>
                  <td className="py-4 px-6 text-gray-600">{tenant.user.gender}</td>
                  <td className="py-4 px-6 text-gray-600 truncate">{tenant.user.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={tenant.acquiredProperty.agent.image || no_image}
                        alt={`${tenant.acquiredProperty.agent.first_name} ${tenant.acquiredProperty.agent.last_name}`}
                        className="w-10 h-10 rounded-full object-cover border border-sky-200"
                      />
                      <span className="text-gray-600">
                        {tenant.acquiredProperty.agent.first_name}{' '}
                        {tenant.acquiredProperty.agent.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/properties/${tenant.acquiredProperty.id}`}
                      className="text-sky-600 hover:text-sky-800 transition-colors"
                    >
                      {tenant.acquiredProperty.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                        tenant.status.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-full font-semibold shadow-sm transition-transform transform hover:scale-105">
                      Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold disabled:opacity-50 hover:bg-sky-200 transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-full font-semibold ${
                page === i + 1
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
              } transition-colors`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold disabled:opacity-50 hover:bg-sky-200 transition-colors"
          >
            Next
          </button>
        </div>
      )}

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
              alt="Tenant"
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