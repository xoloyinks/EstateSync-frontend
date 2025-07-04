"use client";
import React, { useRef, useEffect, useContext } from "react";
import Chart from "chart.js/auto";
import { Tenant, user } from "@/app/(Dashboards)/admin/adminContext";
import { tenantsType } from "@/app/(Dashboards)/admin/tenants/page";
import clsx from "clsx";



export default function AdminDoughnutChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  let tenants = useContext<tenantsType[] | null>(Tenant); // Get tenants from context


  const genderLabels = ["Male", "Female"];

  // Calculate counts for each gender
  const getGenderCounts = () => {
    const counts = new Array(genderLabels.length).fill(0);
    tenants && tenants.forEach((tenant) => {
      const index = genderLabels.indexOf(tenant.user.gender);
      if (index !== -1) {
        counts[index]++;
      }
    });
    return counts;
  };

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const data = getGenderCounts();

      chartInstance.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: genderLabels,
          datasets: [
            {
              label: "Count",
              data, // Use dynamic counts
              backgroundColor: [
                "rgba(59, 130, 246, 0.7)", // blue-500 for Male
                "rgba(34, 197, 94, 0.7)", // green-500 for Female
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(34, 197, 94, 1)",
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
              text: "Tenants by Gender",
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
  }, [tenants]); // Re-run effect when tenants changes

  return (
    <div className="w-[65%] mx-auto flex flex-col items-center">
      <canvas ref={chartRef} width={100} height={100}></canvas>
    </div>
  );
}