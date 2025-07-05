"use client"
import { Chart } from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';

export default function AdminAreaChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists to avoid duplicates
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line', // Area chart is a line chart with fill
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Amount',
              data: [1200000, 19000000, 13000000, 15000000, 22000000, 1080000],
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
                  size: 8, // Set y-axis label font size
                },
              },
          },
          x: {
              display: false,
              grid: {
                display: false, // Remove x-axis grid lines
              },
               ticks: {
                font: {
                  size: 8, // Set x-axis label font size
                },
              },
            },
        },
    }});
    }
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow">
      <canvas ref={chartRef} height={210} />
    </div>
  );
}