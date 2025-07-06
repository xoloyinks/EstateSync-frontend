"use client";
import { PaymentType } from '@/app/types';
import React, { useContext, useState } from 'react'
import { MdOutlinePayment } from 'react-icons/md';
import { Payment } from '../adminContext';



export default function Payments() {
  const [search, setSearch] = useState('');
  const paymentHistory = useContext(Payment);
  const filteredPayments = paymentHistory && paymentHistory?.filter((payment: PaymentType )  => {
    const searchLower = search.toLowerCase();
    return (
      payment.amount.toString().includes(searchLower) ||
      payment.reference.toLowerCase().includes(searchLower) ||
      payment.method.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-4xl mx-auto mt-20 sm:mt-14 bg-white p-8 rounded-xl shadow-2xl relative">
        <div className='text-6xl bg-white text-gray-400 w-fit p-5 rounded-full absolute -top-[15%] shadow-xl shadow-gray-100'>
            <MdOutlinePayment />
        </div>

        <div className='mt-10'>
            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <div className="mb-4">
                <input
                type="text"
                placeholder="Search by amount, reference, method, or status"
                className="w-full sm:w-1/2  border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-700 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-[10px] sm:text-sm rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-sky-700 text-white">
                    <th className="py-2 px-3 text-left">#</th>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Amount</th>
                    <th className="py-2 px-3 text-left">Method</th>
                    <th className="py-2 px-3 text-left">Reference</th>
                    <th className="py-2 px-3 text-left">Customer Code</th>
                    <th className="py-2 px-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {!filteredPayments ? (
                    <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-400">
                        No payments found.
                        </td>
                    </tr>
                    ) : (
                    filteredPayments && filteredPayments.map((payment: PaymentType, idx: number) => (
                        <tr
                        key={idx}
                        className={`
                            ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                            hover:bg-sky-100 transition-colors
                        `}
                        >
                        <td className="py-2 px-3">{idx + 1}</td>
                        <td className="py-2 px-3">
                          {payment?.paid_at &&
                            !isNaN(new Date(payment.paid_at).getTime())
                              ? new Date(payment.paid_at).toLocaleString("en-US", {
                                  month: "long",
                                  day: "2-digit",
                                  year: "numeric",
                                  timeZone: "Africa/Lagos",
                                })
                            : "N/A"}
                        </td>
                        <td className="py-2 px-3">₦{payment.amount.toLocaleString()}</td>
                        <td className="py-2 px-3">{payment.method}</td>
                        <td className="py-2 px-3">{payment.reference}</td>
                        <td className="py-2 px-3">{payment.customer_code}</td>
                        <td className={`py-2 px-3 font-semibold ${payment.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {payment.status}
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
        </div>
      
    </div>
  )
}