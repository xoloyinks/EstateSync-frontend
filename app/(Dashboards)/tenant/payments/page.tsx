"use client";
import React, { useContext, useState } from "react";
import { MdOutlinePayment, MdSearch } from "react-icons/md";
import { PaymentHistory } from "../tenantContext";
import { PaymentType } from "@/app/types";

export default function Payments() {
  const [search, setSearch] = useState("");
  const paymentHistory: PaymentType[] | undefined = useContext(PaymentHistory);

  const filteredPayments = paymentHistory?.filter((payment) => {
    const searchLower = search.toLowerCase();
    return (
      payment.amount.toString().includes(searchLower) ||
      payment.reference.toLowerCase().includes(searchLower) ||
      payment.method.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6 sm:px-10 py-10 bg-white rounded-3xl shadow-2xl relative animate-fade-in">
      <div className="text-5xl text-white bg-sky-700 w-16 h-16 flex items-center justify-center rounded-full absolute -top-8 left-8 shadow-lg">
        <MdOutlinePayment />
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment History</h2>

        <div className="relative mb-6 w-full sm:w-2/3">
          <MdSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-sky-700 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments && filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments?.map((payment, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{payment.method}</td>
                    <td className="px-4 py-3">{payment.reference}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status.toLowerCase() === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
