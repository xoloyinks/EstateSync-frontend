"use client"
import AdminAreaChart from '@/components/adminAreaChart'
import AdminBar from '@/components/adminBar'
import AdminDoughnutChart from '@/components/adminDoughnutChart'
import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { FaHouseUser, FaMoneyBillTrendUp, FaNairaSign } from 'react-icons/fa6'
import { IoIosStats } from 'react-icons/io'
import { MdRealEstateAgent } from 'react-icons/md'
import { Agent, Payment, Property, Tenant } from './adminContext'
import { PaymentType } from '@/app/types'

export default function Dashboard() {
  const agents = useContext(Agent);
  const tenants = useContext(Tenant);
  const properties = useContext(Property)
  const payments: null | PaymentType[] = useContext(Payment);
  const [amounts, setAmounts] = useState(0);

    useEffect(() => {
    if (payments && Array.isArray(payments)) {
      const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
      setAmounts(total);
    }
  }, [payments]);

  // If agents is an array, get the count; otherwise fallback to 0
  const totalAgents = Array.isArray(agents) ? agents.length : 0;
  const totalTenants = Array.isArray(tenants) ? tenants.length : 0;
  const totalPropeties = Array.isArray(properties) ? properties.length : 0;
  return (
    <div>
        <h2 className='font-bold text-xl'>Admin Summaries</h2>
        
        {/* Stats Cards */}
        <div className='mt-5 flex flex-col justify-between sm:flex-row not-sm:gap-4 flex-wrap'>
          <div className='flex gap-6 rounded-2xl bg-white p-6 w-full sm:w-[48%] lg:w-[23%] items-center relative overflow-hidden shadow-gray-200 shadow-xl'>
              <div className="absolute right-0 sm:-left-10 top-5 sm:top-12 text-gray-100 text-9xl">
                <IoIosStats />
              </div>
              <div className='h-12 w-12 min-w-[48px] bg-blue-300 rounded-full text-white flex items-center justify-center border-2 border-blue-200 inset-1'><MdRealEstateAgent /></div>
              <div>
                <h2 className='font-bold text-xl'>{totalAgents}</h2>
                <p className='text-sm font-semibold'>Total agents</p>
              </div>
          </div>

          <div className='flex gap-6 rounded-2xl bg-white p-6 w-full sm:w-[48%] lg:w-[23%] items-center relative overflow-hidden shadow-gray-200 shadow-xl'>
              <div className="absolute right-0 sm:-left-10 top-5 sm:top-12 text-gray-100 text-9xl">
                <IoIosStats />
              </div>
              <div className='h-12 w-12 min-w-[48px] bg-green-300 rounded-full text-white flex items-center justify-center border-2 border-green-200 inset-1'><FaHouseUser /></div>
              <div>
                <h2 className='font-bold text-xl'>{totalTenants}</h2>
                <p className='text-sm font-semibold'>Total tenants</p>
              </div>
          </div>
          
          <div className='flex gap-6 rounded-2xl bg-white p-6 w-full sm:w-[48%] lg:w-[23%] items-center relative overflow-hidden shadow-gray-200 shadow-xl'>
              <div className="absolute right-0 sm:-left-10 top-5 sm:top-12 text-gray-100 text-9xl">
                <IoIosStats />
              </div>
              <div className='h-12 w-12 min-w-[48px] bg-yellow-300 rounded-full text-white flex items-center justify-center border-2 border-yellow-200 inset-1'><FaUser /></div>
              <div>
                <h2 className='font-bold text-xl'>{totalPropeties}</h2>
                <p className='text-sm font-semibold'>Total properties</p>
              </div>
          </div>

          <div className='flex gap-6 rounded-2xl bg-white p-6 w-full sm:w-[48%] lg:w-[23%] items-center relative overflow-hidden shadow-gray-200 shadow-xl'>
              <div className="absolute right-0 sm:-left-10 top-5 sm:top-12 text-gray-100 text-9xl"> 
                <IoIosStats />
              </div>
              <div className='h-12 w-12 min-w-[48px] bg-red-300 rounded-full text-white flex items-center justify-center border-2 border-red-200 inset-1'><FaMoneyBillTrendUp /></div>
              <div>
                <h2 className='font-bold text-xl flex items-center'><FaNairaSign />{amounts.toLocaleString()}</h2>
                <p className='text-sm font-semibold'>Amount generated</p>
              </div>
          </div>
        </div>

        {/* Plots */}
        <div className='mt-5 flex flex-col lg:flex-row gap-3'>
            <div className='w-full lg:w-[70%] h-[520px] lg:h-[480px] p-3 sm:p-5 bg-white rounded-2xl flex items-center mb-3 lg:mb-0'>
              <AdminBar />
            </div>
            <div className='w-full lg:w-[30%] h-[480px] bg-white p-3 rounded-2xl flex flex-col gap-3'>
              <div className='h-[200px] sm:h-[225px]'>
                <AdminDoughnutChart />
              </div>
              <div className='h-[220px] sm:h-[242px]'>
                <AdminAreaChart />
              </div>
            </div>
        </div>
    </div>
  )
}