"use client";
import { useGetPropertiesQuery } from '@/app/api/properties';
import { PropertyType } from '@/app/types';
import Property from '@/components/property';
import React, { useEffect, useState } from 'react';


const PROPERTIES_PER_PAGE = 6;

export default function Properties() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [paginatedProperties, setPaginatedProperties] = useState<PropertyType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isLoading } = useGetPropertiesQuery([]);

  console.log(filteredProperties);

  useEffect(() => {
    if (data) {
      const filtered = data.data.filter((prop: PropertyType) => {
        const q = search.toLowerCase();
        return (
          prop.price.toLowerCase().includes(q) ||
          prop.bedrooms.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q) ||
          prop.title.toLowerCase().includes(q)
        );
      });

      setFilteredProperties(filtered);
      setTotalPages(Math.ceil(filtered.length / PROPERTIES_PER_PAGE));
      setPaginatedProperties(
        filtered.slice(
          (page - 1) * PROPERTIES_PER_PAGE,
          page * PROPERTIES_PER_PAGE
        )
      );
    } else {
      setFilteredProperties([]);
      setPaginatedProperties([]);
      setTotalPages(1);
    }
  }, [data, search, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Reset to first page if search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <section className='relative'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <h1 className='text-2xl text-left sm:text-4xl font-bold w-full'>Properties</h1>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by price, bedrooms, location, title"
          className="border-2 border-gray-300 rounded-xl p-2 w-full sm:w-1/2 mt-4 focus:ring-2 focus:ring-sky-700 focus:border-sky-700 transition outline-none bg-gray-50 placeholder-gray-400"
        />
      </div>

      <div className='mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 not-sm:w-full'>
        {isLoading && "Loading Properties..."}
        {!isLoading && paginatedProperties.length === 0 && (
          <p>No properties found.</p>
        )}
        {paginatedProperties.map((prop: PropertyType, idx: number) => (
          <Property
            key={idx + (page - 1) * PROPERTIES_PER_PAGE}
            images={prop.images}
            location={prop.location}
            agent={prop.agent}
            title={prop.title}
            bedrooms={prop.bedrooms}
            price={prop.price}
            description={prop.description}
            mode={prop.mode}
            id={prop.id}
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