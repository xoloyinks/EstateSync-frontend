"use client"
import React, { useContext } from 'react'
import { FaMapPin, FaNairaSign } from 'react-icons/fa6'
import { HiHomeModern, HiMiniHomeModern } from 'react-icons/hi2'
import { MdVerified, MdWarning } from 'react-icons/md'
import { SiWebmoney } from 'react-icons/si'
import TenantDoughnutChart from '@/components/tenantDoughnutChart'
import LeaseTermProgression from '@/components/leaseTermProgression'
import { Payment, Tenant } from './tenantContext'
import { useRouter } from 'next/navigation'


export default function Page() {
  const data = useContext(Tenant);
  const payment = useContext(Payment);
  const router = useRouter();

  // Helper function to calculate months difference between two dates
  const getMonthsDifference = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0; // Invalid dates
    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();
    let totalMonths = yearsDiff * 12 + monthsDiff;
    // Adjust if the current day is before the start day in the month
    if (end.getDate() < start.getDate()) {
      totalMonths -= 1;
    }
    return Math.max(0, Math.min(totalMonths, 12)); // Clamp between 0 and 12
  };


  const currentDate = new Date('2025-07-03T21:33:00+01:00'); // Current date (July 3, 2025, 9:33 PM WAT)
  const createdAt = payment?.created_at;
  const nextPaymentDate = payment?.next_payment_date;

  // Calculate the current month (1-based index for display, 0 if invalid)
  const currentMonth = createdAt
    ? getMonthsDifference(createdAt, currentDate) + 1 // Add 1 to make it 1-based (e.g., 1st month is 1, not 0)
    : 0;

  // Total months for an annual plan
  const totalMonths = 12;

  // Optional: Validate next_payment_date aligns with an annual cycle
  let isValidAnnualCycle = true;
  if (createdAt && nextPaymentDate) {
    const monthsToNextPayment = getMonthsDifference(createdAt, nextPaymentDate);
    isValidAnnualCycle = monthsToNextPayment % 12 === 0; // Check if next_payment_date is a multiple of 12 months from created_at
  }

  return (
    <div className="w-full h-full space-y-5">
      <h2 className="text-2xl font-semibold">Overview</h2>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Stats and graph */}
        <div className="w-full lg:w-[60%] space-y-10">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full mx-auto space-y-3 transition-all hover:shadow-xl hover:-translate-y-1">
              {/* Header with Icon and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SiWebmoney className="text-gray-300 text-3xl" />
                  <h3 className="text-lg font-semibold text-sky-700">Rent Status</h3>
                </div>
                <div
                  className={`text-5xl ${
                    data?.status === 'paid' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {data?.status === 'paid' ? <MdVerified /> : <MdWarning />}
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${
                  data?.status === 'paid' ? 'bg-green-500' : 'bg-red-400'
                }`}
              >
                {data?.status?.toUpperCase() || 'UNKNOWN'}
              </span>

              {/* Price */}
              <div className="flex items-center space-x-1 text-xl font-bold text-gray-800">
                <FaNairaSign className="text-gray-600" />
                <span>
                  {data?.acquiredProperty?.price
                    ? Number(data.acquiredProperty.price).toLocaleString()
                    : 'N/A'}
                </span>
              </div>

              {/* Due Date */}
              <p className="text-xs text-red-500 font-medium">
                Due date:{" "}
                {payment?.next_payment_date &&
                !isNaN(new Date(payment.next_payment_date).getTime())
                  ? new Date(payment.next_payment_date).toLocaleString([], {
                      month: "long", // Full month name (e.g., "July")
                      day: "2-digit", // Day with leading zero (e.g., "03")
                      year: "numeric", // Full year (e.g., "2025")
                    })
                  : "N/A"}
              </p>
            </div>

            {/* <div className="bg-white shadow-xl relative overflow-hidden shadow-gray-200 rounded-xl p-5 w-full sm:w-[48%] space-y-2">
              <div className="absolute -right-5 top-10 text-gray-100 text-9xl">
                <SiWebmoney />
              </div>
              <div className="text-5xl absolute right-5 top-5 text-sky-700">
                {verified}
              </div>
              <p className="text-sm font-semibold text-sky-700">Rent Status</p>
              <p className="text-[10px] p-[2px] rounded bg-green-400 text-white w-fit">Paid</p>
              <p className="flex items-center text-2xl font-semibold">
                <FaNairaSign /> 450,000
              </p>
              <p className="text-red-500 text-xs">Due date: August 20, 2025</p>
            </div> */}
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-5">
            <div className="w-full sm:w-1/2 p-5 bg-white rounded-2xl shadow-xl shadow-gray-200">
              <TenantDoughnutChart />
            </div>
            <div className="w-full sm:w-1/2 p-5 bg-white rounded-2xl shadow-xl shadow-gray-200">
              <LeaseTermProgression name={payment?.user.first_name || ''} current={currentMonth} total={totalMonths} />
            </div>
          </div>
        </div>

        {/* Current apartment or List of available properties */}
        <div className="w-full lg:w-[40%] p-5 bg-white rounded-xl shadow-gray-200 shadow-xl relative mt-10 lg:mt-0">
          <div className="text-9xl bg-white text-gray-400 w-fit p-5 rounded-full absolute -top-[8%] left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-top-[15%] lg:right-0 shadow-xl shadow-gray-100">
            <HiHomeModern />
          </div>
          <div className="absolute -right-5 -bottom-5 text-gray-100 text-9xl">
            <SiWebmoney />
          </div>
          <div className="mt-20 space-y-5 text-gray-400">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-2xl font-semibold">Mi Casa</span>
              <span className="rounded w-fit p-2 text-sm shadow-xl shadow-gray-200 text-gray-400">
                On going rent
              </span>
            </div>

            <div className="text-md font-semibold w-full sm:w-[80%]">
              {data?.acquiredProperty.title}
            </div>

             <div className="text-sm font-semibold w-full sm:w-[80%]">
              {data?.acquiredProperty.description}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <FaMapPin />
              <span>{data?.acquiredProperty.location}</span>
            </div>

            <div className="flex items-center gap-2 rounded w-fit text-md">
              <HiMiniHomeModern />
              <span>{data?.acquiredProperty.bedrooms}</span>
            </div>
          </div>

          <div className="space-y-5 border-t-2 border-gray-100 py-5 gap-2 mt-5">
            <div className="text-sm font-semibold text-gray-500">My Agent</div>
            <div className="relative w-20 h-20 mt-1">
              <img
                alt="Agent Image"
                src={data?.acquiredProperty.agent.image}
                className="border-2 border-gray-200 w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-gray-600">{data?.acquiredProperty.agent.last_name} {data?.acquiredProperty.agent.first_name}</p>
              <p className="gap-2 text-gray-500">{data?.acquiredProperty.agent.email}</p>
              <button onClick={() => router.push('/tenant/messages')} className="bg-sky-700 px-10 py-2 text-white cursor-pointer rounded mt-4">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}