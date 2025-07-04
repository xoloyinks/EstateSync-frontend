"use client"
import React, { useState } from 'react'


type InputType = {
    placeholder?: string
    type?: string
    value: string
    name: string
    label: string
    disabled?: boolean
    onChange: any
}

export default function Input({placeholder = '', type= 'text', value, name, onChange, label, disabled = false} : InputType) {
    const [inValue, setInvalue] = useState(value)

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target)
    }

  return (
   <div className='flex flex-col'>
    <label className='text-sm font-semibold' htmlFor={name}>{label}</label>
     <input disabled={disabled} onChange={handleValueChange} name={name} placeholder={placeholder} value={value} type={type} className='py-2 focus:outline-none border-b border-black placeholder:text-gray-300 focus:placeholder:text-gray-200'  />
   </div>
  )
}
