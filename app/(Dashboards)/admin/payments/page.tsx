"use client";
import React, { useState } from 'react'
import { MdOutlinePayment } from 'react-icons/md';
import { SiGoogleforms } from 'react-icons/si';

const paymentHistory = [
  {
    id: 1,
    date: '2024-05-01',
    amount: 120000,
    method: 'Bank Transfer',
    status: 'Successful',
    reference: 'INV-20240501-001',
  },
  {
    id: 2,
    date: '2024-04-01',
    amount: 120000,
    method: 'Card',
    status: 'Successful',
    reference: 'INV-20240401-002',
  },
  {
    id: 3,
    date: '2024-03-01',
    amount: 120000,
    method: 'Bank Transfer',
    status: 'Failed',
    reference: 'INV-20240301-003',
  },
];

export default function Payments() {
  const [search, setSearch] = useState('');

  const filteredPayments = paymentHistory.filter(payment => {
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
                    <th className="py-2 px-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-400">
                        No payments found.
                        </td>
                    </tr>
                    ) : (
                    filteredPayments.map((payment, idx) => (
                        <tr
                        key={payment.id}
                        className={`
                            ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                            hover:bg-sky-100 transition-colors
                        `}
                        >
                        <td className="py-2 px-3">{payment.id}</td>
                        <td className="py-2 px-3">{payment.date}</td>
                        <td className="py-2 px-3">₦{payment.amount.toLocaleString()}</td>
                        <td className="py-2 px-3">{payment.method}</td>
                        <td className="py-2 px-3">{payment.reference}</td>
                        <td className={`py-2 px-3 font-semibold ${payment.status === 'Successful' ? 'text-green-600' : 'text-red-600'}`}>
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