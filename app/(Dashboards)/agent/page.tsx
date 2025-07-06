"use client";
import React, { useContext, useEffect, useState } from 'react'
import { LuTableProperties } from 'react-icons/lu'
import { IoIosStats } from 'react-icons/io'
import { MdBuildCircle, MdOutlinePeopleAlt } from 'react-icons/md';
import { FaMoneyCheckDollar } from 'react-icons/fa6'
import { AgentIssues, Payments, Properties, User } from './agentContext';
import { useGetApplicationsQuery } from '@/app/api/general';
import { ApplicationsType, userType } from '@/app/types';

export default function Agent() {
  const [propertyCount, setPropertyCount] = useState(0);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [rentsCount, setRentsCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [search, setSearch] = useState('');
  const properties = useContext(Properties)
  const issues = useContext(AgentIssues)
  const { data: applications } = useGetApplicationsQuery(null);
  const [appCounts, setAppCounts] = useState(0)
  const user: userType | undefined = useContext(User);
  const paymentData = useContext(Payments)

  useEffect(() => {
    if (applications?.data && user?.id) {
          // Filter applications by agent ID
            const filteredApplications = applications.data.filter(
            (app: ApplicationsType) => {
              const isMatch = app.property.agent.id === user?.id;
              return isMatch
            }
          );

          setAppCounts(filteredApplications.length)
      }
  }, [applications])

  // Animate numbers to 30 fast for each category
  useEffect(() => {
    function countNumber({ number, category }: { number: number, category: string }) {
      let start: number;
      if(number > 20){
        start = number - 20;
      }else{
        start = number - 0
      }
      const end = number;
      const duration = 500; // ms
      const increment = Math.ceil(end / (duration / 16)); // ~60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          if (category === 'property') setPropertyCount(end);
          else if (category === 'inquiries') setInquiriesCount(end);
          else if (category === 'rents') setRentsCount(end);
          else if (category === 'maintenance') setMaintenanceCount(end);
          clearInterval(timer);
        } else {
          if (category === 'property') setPropertyCount(start);
          else if (category === 'inquiries') setInquiriesCount(start);
          else if (category === 'rents') setRentsCount(start);
          else if (category === 'maintenance') setMaintenanceCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }

    countNumber({ number: properties?.length || 0, category: 'property' });
    countNumber({ number: appCounts || 0, category: 'inquiries' });
    countNumber({ number: 0, category: 'rents' });
    countNumber({ number: issues?.length || 0, category: 'maintenance' });
  }, [properties]);

  // Filter payment data
  const filteredPayments = paymentData && paymentData.filter((payment) => {
    const searchLower = search.toLowerCase();
    return (
      // payment.amount.toString().includes(searchLower) ||
      payment.reference?.toLowerCase().includes(searchLower) ||
      payment.method?.toLowerCase().includes(searchLower) ||
      payment.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section className='space-y-5'>
      <h2 className="text-2xl font-semibold ">Overview</h2>

      <div className='flex flex-wrap gap-4 justify-between'>
        <div className='w-full sm:w-[23%] bg-white shadow-xl shadow-gray-200 rounded-xl p-5 space-y-1 relative overflow-hidden'>
          <div className="absolute -right-5 top-10 text-gray-100 text-9xl">
            <IoIosStats />
          </div>
          <LuTableProperties className='text-xl' />
          <h2 className='text-sm font-bold text-gray-500'>Total Properties</h2>
          <h1 className='text-6xl font-bold text-sky-700'>{propertyCount}</h1>
        </div>
        <div className='w-full sm:w-[23%] bg-white shadow-xl shadow-gray-200 rounded-xl p-5 space-y-1 relative overflow-hidden'>
          <div className="absolute -right-5 top-10 text-gray-100 text-9xl">
            <IoIosStats />
          </div>
          <MdOutlinePeopleAlt className='text-xl' />
          <h2 className='text-sm font-bold text-gray-500'>Total Inquiring Clients</h2>
          <h1 className='text-6xl font-bold text-sky-700'>{inquiriesCount}</h1>
        </div>
        <div className='w-full sm:w-[23%] bg-white shadow-xl shadow-gray-200 rounded-xl p-5 space-y-1 relative overflow-hidden'>
          <div className="absolute -right-5 top-10 text-gray-100 text-9xl">
            <IoIosStats />
          </div>
          <FaMoneyCheckDollar className='text-xl' />
          <h2 className='text-sm font-bold text-gray-500'>Total Rents Due</h2>
          <h1 className='text-6xl font-bold text-sky-700'>{rentsCount}</h1>
        </div>
        <div className='w-full sm:w-[23%] bg-white shadow-xl shadow-gray-200 rounded-xl p-5 space-y-1 relative overflow-hidden'>
          <div className="absolute -right-5 top-10 text-gray-100 text-9xl">
            <IoIosStats />
          </div>
          <MdBuildCircle className='text-xl' />
          <h2 className='text-sm font-bold text-gray-500'>Total Maintenance Pending</h2>
          <h1 className='text-6xl font-bold text-sky-700'>{maintenanceCount}</h1>
        </div>
      </div>

      <div className='flex justify-between'>
        <div className='w-full sm:w-[75%] bg-white p-5 rounded-xl shadow-xl shadow-gray-200 h-full'>
          <div className='flex justify-between items-center flex-col sm:flex-row gap-3'>
            <h3 className='text-md font-semibold'>Payment History</h3>
            <input
              className='border-2 border-gray-300 rounded-xl p-2 w-full sm:w-1/2 focus:ring-2 focus:ring-sky-700 focus:border-sky-700 transition outline-none bg-gray-50 placeholder-gray-400 placeholder:text-xs'
              placeholder="Search by reference, method, amount, property, date"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full overflow-x-auto mt-5 rounded-lg">
            <table className='min-w-[600px] w-full border-collapse bg-white rounded-lg overflow-hidden text-xs'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-3 text-left'>#</th>
                  <th className='p-3 text-left'>Date</th>
                  <th className='p-3 text-left'>Payment Reference</th>
                  <th className='p-3 text-left'>Payment Method</th>
                  <th className='p-3 text-left'>Amount</th>
                  <th className='p-3 text-left'>Customer Code</th>
                  <th className='p-3 text-left'>Status</th>

                </tr>
              </thead>
              <tbody>
                {filteredPayments && filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">No records found.</td>
                  </tr>
                ) : (
                 filteredPayments && filteredPayments.map((row, idx) => (
                    <tr key={idx}>
                      <td className='p-3'>{idx + 1}</td>
                      <td className='p-3'>
                         {row?.paid_at &&
                          !isNaN(new Date(row.paid_at).getTime())
                          ? new Date(row.paid_at).toLocaleString("en-US", {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                            timeZone: "Africa/Lagos",
                          })
                          : "N/A"}
                      </td>
                      <td className='p-3'>{row.reference}</td>
                      <td className='p-3'>{row.method}</td>
                      <td className='p-3'>₦{Number(row.amount).toLocaleString()}</td>
                      <td className='p-3'>{row.customer_code}</td>
                      <td className='p-3 text-green-600'>{row.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}