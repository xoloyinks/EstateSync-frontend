"use client";
import React, { useRef, useEffect, useContext, useMemo } from 'react';
import Chart from 'chart.js/auto';
import type { issuesType } from '@/app/types';
import { Issue } from '@/app/(Dashboards)/tenant/tenantContext';

export default function TenantDoughnutChart() {
  const issues = useContext(Issue); // issuesType[] | null
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const maintenanceLabels = [
    'Plumbing',
    'Electrical',
    'Appliances',
    'Structural',
    'Sanitation & Waste',
    'Security',
    'Internet/Connectivity',
    'Cleaning & Groundskeeping',
  ];

  // Count issues per category
  const categoryCounts = useMemo(() => {
    const counts = new Array(maintenanceLabels.length).fill(0);
    if (issues && Array.isArray(issues)) {
      issues.forEach((issue: issuesType) => {
        const index = maintenanceLabels.indexOf(issue.category);
        if (index !== -1) {
          counts[index]++;
        } else {
          console.warn(`Unrecognized category: ${issue.category}`);
        }
      });
    } else {
      console.warn('Issues is null or not an array:', issues);
    }
    return counts;
  }, [issues]);

  useEffect(() => {
    if (!chartRef.current) {
      console.error('Chart canvas ref is null');
      return;
    }

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    try {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'pie',
        data: {
          labels: maintenanceLabels,
          datasets: [
            {
              label: 'Issues by Category',
              data: categoryCounts,
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)', // blue-500
                'rgba(34, 197, 94, 0.7)', // green-500
                'rgba(251, 191, 36, 0.7)', // yellow-400
                'rgba(239, 68, 68, 0.7)', // red-500
                'rgba(168, 85, 247, 0.7)', // purple-500
                'rgba(16, 185, 129, 0.7)', // emerald-500
                'rgba(244, 63, 94, 0.7)', // rose-500
                'rgba(52, 211, 153, 0.7)', // teal-400
              ],
              borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(251, 191, 36, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(244, 63, 94, 1)',
                'rgba(52, 211, 153, 1)',
              ],
              borderWidth: 1,
            },
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
              text: 'Maintenance Issues by Category',
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [categoryCounts]); // Depend on categoryCounts

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {issues && issues.length > 0 ? (
        <canvas ref={chartRef} />
      ) : (
        <div className="text-center text-gray-500">No issues data available to display.</div>
      )}
    </div>
  );
}