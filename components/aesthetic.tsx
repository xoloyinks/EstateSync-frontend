import React from 'react'
import { GiButterflyFlower } from 'react-icons/gi'


export default function Aesthetic({size, position}: {size: string, position: string}) {
  return (
    <section className={`${size} text-gray-50 absolute ${position}`}>
        <GiButterflyFlower />
    </section>
  )
}
