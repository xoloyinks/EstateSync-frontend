"use client";
import React, { useRef, useEffect, useContext } from "react";
import Chart from "chart.js/auto";
import { Issue } from "@/app/(Dashboards)/admin/adminContext";
import { issuesType } from "@/app/types";

// The type for the array
type MaintenanceRequests = issuesType[];
export default function AdminBar() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const issues = useContext<MaintenanceRequests | null>(Issue); // Get issues from context

  const maintenanceLables = [
    "Plumbing",
    "Electrical",
    "Appliance Issues",
    "Structural",
    "Sanitation & Waste",
    "Security",
    "Internet/Connectivity",
    "Cleaning & Groundskeeping",
  ];

  // Calculate counts for each category
  const getCategoryCounts = () => {
    const counts = new Array(maintenanceLables.length).fill(0);
    if(issues){
       issues.forEach((request) => {
      const index = maintenanceLables.indexOf(request.category);
      if (index !== -1) {
        counts[index]++;
      }
    });
    }
   
    return counts;
  };

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const data = getCategoryCounts();

      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: maintenanceLables,
          datasets: [
            {
              label: "Issues",
              data, // Use dynamic counts
              backgroundColor: [
                "rgba(59, 130, 246, 0.7)", // blue-500
                "rgba(34, 197, 94, 0.7)", // green-500
                "rgba(251, 191, 36, 0.7)", // yellow-400
                "rgba(239, 68, 68, 0.7)", // red-500
                "rgba(168, 85, 247, 0.7)", // purple-500
                "rgba(16, 185, 129, 0.7)", // emerald-500
                "rgba(244, 63, 94, 0.7)", // rose-500
                "rgba(52, 211, 153, 0.7)", // teal-400
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(34, 197, 94, 1)",
                "rgba(251, 191, 36, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(168, 85, 247, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(244, 63, 94, 1)",
                "rgba(52, 211, 153, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: "Maintenance Distribution",
            },
          },
          scales: {
            y: {
              grid: {
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [issues]); // Re-run effect when issues changes

  return (
    <div className="w-full flex flex-col items-center">
      <canvas ref={chartRef} width={100} height={0} className="h-[400px] sm:h-full"></canvas>
    </div>
  );
}