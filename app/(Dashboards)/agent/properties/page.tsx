"use client";
import { PropertyType } from '@/app/types';
import Property from '@/components/property';
import { Properties as MyProperties } from '../agentContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';

const PROPERTIES_PER_PAGE = 6;

export default function Properties() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const properties: PropertyType[] | undefined = useContext(MyProperties);

  // Memoize filtered properties to avoid recalculating on every render
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    const q = search.toLowerCase();
    return properties.filter((prop) =>
      [prop.price, prop.bedrooms, prop.location, prop.title].some((field) =>
        field?.toString().toLowerCase().includes(q)
      )
    );
  }, [properties, search]);

  // Calculate total pages and paginated properties
  const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (page - 1) * PROPERTIES_PER_PAGE;
    const end = start + PROPERTIES_PER_PAGE;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, page]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <section className="relative">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl text-left sm:text-4xl font-bold w-full">Properties</h1>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by price, bedrooms, location, title"
          className="border-2 border-gray-300 rounded-xl p-2 w-full sm:w-1/2 mt-4 focus:ring-2 focus:ring-sky-700 focus:border-sky-700 transition outline-none bg-gray-50 placeholder-gray-400"
        />
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 not-sm:w-full">
        {paginatedProperties.map((prop: PropertyType, idx: number) => (
          <Property
            key={prop.id || idx + (page - 1) * PROPERTIES_PER_PAGE} // Use prop.id if available
            images={prop.images}
            location={prop.location}
            agent={prop.agent}
            title={prop.title}
            bedrooms={prop.bedrooms}
            price={prop.price}
            description={prop.description}
            mode={prop.mode}
            id={prop.id}
            acquired={prop.acquired}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 not-sm:fixed bottom-0 z-40 not-sm:backdrop-blur-3xl not-sm:w-full left-0">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-sky-700 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}