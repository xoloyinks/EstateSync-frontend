import React from 'react'

interface LeaseTermProgressionProps {
  current: number; // months elapsed
  total: number;   // total lease months
  name: string
}

export default function LeaseTermProgression({ current, total, name }: LeaseTermProgressionProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  const monthsLeft = total - current;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-10">
        <div className='text-sm font-medium text-gray-700'>
            Progression Bar for {total} months
        </div>
        <div className='text-sm'>
            <p className='font-medium'>Hello {name}! 👋</p>
            <p>You still have {monthsLeft} months left before rent is due. </p>
        </div>
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Lease Progression
        </span>
        <span className="text-xs text-gray-500">
          {monthsLeft} month{monthsLeft !== 1 ? 's' : ''} left
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-10 overflow-hidden">
        <div
          className="bg-sky-700 h-10 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        
      </div>
      <div className="text-right text-xs text-gray-600 font-medium">
        {percent}% complete
      </div>
      
    </div>
  );
}
