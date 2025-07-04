"use client";
import { useGetIssuesQuery } from '@/app/api/issues';
import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  image: string;
  role: string;
  createdAt: string;
  gender: string;
}

interface Agent {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  image: string;
  role: string;
  createdAt: string;
  gender: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  agent: Agent;
  mode: string;
  bedrooms: string;
  createdAt: string;
}

interface Issue {
  _id: string;
  user: User;
  property: Property;
  category: string;
  issue: string;
  description: string;
  agent: string;
  createdAt: string;
  status: 'Pending' | 'Solved';
}

export default function AgentRequestsPage() {
  const { data, isLoading } = useGetIssuesQuery([]);
  const [requests, setRequests] = useState<Issue[]>([]);

  // Filter states
  const [tenantFilter, setTenantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [issueFilter, setIssueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Update requests when data changes
  useEffect(() => {
    if (data?.data) {
      setRequests(data.data);
    }
  }, [data]);

  // Filtering logic
  const filteredRequests = requests.filter((req) => {
    const tenantName = `${req.user.first_name} ${req.user.last_name}`.toLowerCase();
    const createdDate = new Date(req.createdAt).toISOString().split('T')[0];
    return (
      (tenantFilter === '' || tenantName.includes(tenantFilter.toLowerCase())) &&
      (statusFilter === '' || req.status === statusFilter) &&
      (propertyFilter === '' || req.property.title.toLowerCase().includes(propertyFilter.toLowerCase())) &&
      (issueFilter === '' || req.issue.toLowerCase().includes(issueFilter.toLowerCase())) &&
      (dateFilter === '' || createdDate === dateFilter)
    );
  });

  // Unique values for dropdowns
  const uniqueProperties = Array.from(new Set(requests.map((r) => r.property.title)));
  const uniqueIssues = Array.from(new Set(requests.map((r) => r.issue)));

  return (
    <section className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-sky-900 tracking-tight mb-8">
        Maintenance Requests
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Filter by tenant name"
          className="px-4 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-400 text-gray-700"
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Solved">Solved</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-gray-700"
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
        >
          <option value="">All Properties</option>
          {uniqueProperties.map((prop) => (
            <option key={prop} value={prop}>
              {prop}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-gray-700"
          value={issueFilter}
          onChange={(e) => setIssueFilter(e.target.value)}
        >
          <option value="">All Issues</option>
          {uniqueIssues.map((iss) => (
            <option key={iss} value={iss}>
              {iss}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="px-4 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-gray-700"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-100">
        <table className="min-w-full bg-white text-xs">
          <thead className="bg-sky-50 text-sky-800 font-semibold">
            <tr>
              <th className="py-4 px-6 text-left">#</th>
              <th className="py-4 px-6 text-left">Tenant</th>
              <th className="py-4 px-6 text-left">Property</th>
              <th className="py-4 px-6 text-left">Category</th>
              <th className="py-4 px-6 text-left">Issue</th>
              <th className="py-4 px-6 text-left">Description</th>
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 text-lg">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filteredRequests.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 text-lg">
                  No requests found.
                </td>
              </tr>
            )}
            {!isLoading &&
              filteredRequests.map((req, idx) => (
                <tr
                  key={req._id}
                  className={`border-b border-gray-100 hover:bg-sky-50 transition-colors last:border-b-0 ${
                    idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="py-4 px-6">{idx + 1}</td>
                  <td className="py-4 px-6">{`${req.user.first_name} ${req.user.last_name}`}</td>
                  <td className="py-4 px-6">{req.property.title}</td>
                  <td className="py-4 px-6">{req.category}</td>
                  <td className="py-4 px-6">{req.issue}</td>
                  <td className="py-4 px-6 truncate max-w-xs">{req.description}</td>
                  <td className="py-4 px-6">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                        req.status === 'Pending'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}