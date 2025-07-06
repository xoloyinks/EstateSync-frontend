"use client"
import { Payment } from '@/app/(Dashboards)/admin/adminContext';
import { PaymentType } from '@/app/types';
import { Chart } from 'chart.js/auto';
import React, { useContext, useEffect, useRef } from 'react';

export default function AdminAreaChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const paymentHistory: null | PaymentType[] = useContext(Payment);

  // Prepare data for the chart
  // Group payments by month and sum the amounts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const monthlyTotals = new Array(12).fill(0);

  if (paymentHistory) {
    paymentHistory.forEach(payment => {
      const date = new Date(payment.paid_at);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        monthlyTotals[monthIndex] += Number(payment.amount);
      }
    });
  }

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists to avoid duplicates
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line', // Area chart is a line chart with fill
        data: {
          labels: months,
          datasets: [
            {
              label: 'Amount',
              data: monthlyTotals,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              tension: 0.4,
            }
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Amount made this year',
            },
          },
          scales: {
            y: {
              display: false,
              beginAtZero: true,
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 8,
                },
              },
            },
            x: {
              display: false,
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 8,
                },
              },
            },
          },
        }
      });
    }
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [paymentHistory]); // Re-run effect when paymentHistory changes

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow">
      <canvas ref={chartRef} height={210} />
    </div>
  );
}