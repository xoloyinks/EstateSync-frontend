'use client';
import { useGetPropertiesQuery } from '@/app/api/properties';
import Property from '@/components/property';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/isloading';
import { PropertyType } from '../types';

const PROPERTIES_PER_PAGE = 6;

const Properties: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [paginatedProperties, setPaginatedProperties] = useState<PropertyType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data, isLoading } = useGetPropertiesQuery([]);

  useEffect(() => {
    if (data?.data) {
      // properties not acquired
      const filtered = data.data.filter((prop: PropertyType) =>
        ['price', 'bedrooms', 'location', 'title'].some((key) =>
          (prop[key as keyof PropertyType] as string)?.toLowerCase().includes(search.toLowerCase())
        )
      );

      setFilteredProperties(filtered);
      setTotalPages(Math.ceil(filtered.length / PROPERTIES_PER_PAGE));
      setPaginatedProperties(
        filtered.slice((page - 1) * PROPERTIES_PER_PAGE, page * PROPERTIES_PER_PAGE)
      );

      console.log(data.data)
    } else {
      setFilteredProperties([]);
      setPaginatedProperties([]);
      setTotalPages(1);
    }
  }, [data, search, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gray-50 min-h-screen">
      <Nav />
      <div className="px-4 sm:px-16 lg:px-44 border-2 border-black py-22 sm:py-32">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
            Explore Properties
          </h1>
          <div className="relative w-full sm:w-1/2">
            <input
              type="search"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search by price, bedrooms, location, or title"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-gray-400 text-gray-700"
              aria-label="Search properties"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 sm:flex-wrap w-full">
          {isLoading && (
            <div className="col-span-full text-center py-12">
              <Loading />
              <p className="mt-4 text-gray-600">Loading Properties...</p>
            </div>
          )}
          {!isLoading && paginatedProperties.length === 0 && (
            <p className="col-span-full text-center text-gray-600 py-12">
              No properties found. Try adjusting your search.
            </p>
          )}
          {paginatedProperties.map((prop: PropertyType, idx: number) => (
            !prop.acquired &&
            <Property
              key={prop.id ?? `${prop.title}-${idx + (page - 1) * PROPERTIES_PER_PAGE}`}
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
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                aria-current={page === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Properties;