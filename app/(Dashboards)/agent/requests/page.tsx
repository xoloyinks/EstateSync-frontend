"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AgentIssues } from '../agentContext';
import { issuesType } from '@/app/types';

export default function AgentRequestsPage() {
  const [requests, setRequests] = useState<issuesType[] | undefined>();
  const issues = useContext(AgentIssues);

  // Filter states
  const [tenantFilter, setTenantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [issueFilter, setIssueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<string>(''); // Changed to string for input compatibility

  const handleStatusChange = (id: string, newStatus: 'Pending' | 'Solved') => {
    setRequests((prev) =>
      prev?.map((req) =>
        req._id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const [filteredRequests, setFilteredRequests] = useState<issuesType[] | undefined>(); // Moved to state

  useEffect(() => {
    // Filtering logic
    if (issues) {
      const filtered = issues.filter((req) => {
        const createdAtDate = new Date(req.createdAt).toISOString().split('T')[0]; // Normalize to YYYY-MM-DD
        return (
          (tenantFilter === '' ||
            `${req.user.first_name} ${req.user.last_name}`
              .toLowerCase()
              .includes(tenantFilter.toLowerCase())) &&
          (statusFilter === '' || req.status === statusFilter) &&
          (propertyFilter === '' ||
            req.property.title.toLowerCase().includes(propertyFilter.toLowerCase())) &&
          (issueFilter === '' || req.issue.toLowerCase().includes(issueFilter.toLowerCase())) &&
          (dateFilter === '' || createdAtDate === dateFilter)
        );
      });
      setFilteredRequests(filtered);
    }
  }, [issues, tenantFilter, statusFilter, propertyFilter, issueFilter, dateFilter]);

  console.log(filteredRequests)

  // Unique values for dropdowns
  const uniqueProperties = Array.from(new Set(issues && issues.map((r) => r.property.title)));
  const uniqueIssues = Array.from(new Set(issues && issues.map((r) => r.issue)));

  return (
    <section className="p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Submitted Maintenance Requests</h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by tenant"
          className="border rounded px-2 py-1"
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Solved">Solved</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
        >
          <option value="">All Properties</option>
          {uniqueProperties.map((prop) => (
            <option key={prop} value={prop}>{prop}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={issueFilter}
          onChange={(e) => setIssueFilter(e.target.value)}
        >
          <option value="">All Issues</option>
          {uniqueIssues.map((iss) => (
            <option key={iss} value={iss}>{iss}</option>
          ))}
        </select>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)} // Value is string in YYYY-MM-DD
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full rounded-lg overflow-hidden text-sm min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">Tenant</th>
              <th className="py-2 px-3 text-left">Property</th>
              <th className="py-2 px-3 text-left">Category</th>
              <th className="py-2 px-3 text-left">Issue</th>
              <th className="py-2 px-3 text-left">Description</th>
              <th className="py-2 px-3 text-left">Date</th>
              <th className="py-2 px-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests?.map((req: issuesType, idx: number) => (
              <tr
                key={idx}
                className={`
                  text-xs
                  ${idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}
                  hover:bg-gray-100 transition-colors
                `}
              >
                <td className="py-2 px-3">{idx + 1}</td>
                <td className="py-2 px-3">{req.user.last_name} {req.user.first_name}</td>
                <td className="py-2 px-3">{req.property.title}</td>
                <td className="py-2 px-3">{req.category}</td>
                <td className="py-2 px-3">{req.issue}</td>
                <td className="py-2 px-3">{req.description}</td>
                <td className="py-2 px-3">
                  {new Date(req.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
                <td className="py-2 px-3">
                  <span className={`text-white w-fit p-1 rounded ${req.status && req.status.toLocaleLowerCase() === 'pending' ? 'bg-red-400' : 'bg-green-600'}`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredRequests?.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}