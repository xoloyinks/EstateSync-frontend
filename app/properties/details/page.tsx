import Footer from '@/components/footer'
import Nav from '@/components/nav'
import PropertyDetails from '@/components/propertyDetails'
import React from 'react'

export default function Details() {
  return (
    <section>
        <Nav />
        <div className='sm:px-52 px-5 py-20 sm:py-32'>
            <PropertyDetails />
        </div>
        <Footer />
    </section>
  )
}
