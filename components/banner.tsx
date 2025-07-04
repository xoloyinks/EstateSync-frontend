import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

export default function Banner() {
  return (
    <section className='w-screen h-screen sm:px-20 px-3 relative overflow-x-hidden'>
        {/* Portrait design */}
        <div className='w-[1000px] h-[500px] overflow-hidden absolute z-10 -rotate-45 not-sm:left-52 not-sm:opacity-80 -top-32 sm:-right-20 sm:-top-20 rounded bg-black'>
            <div
                style={{
                    backgroundImage: "url('/images/pexels-binyaminmellish-186077.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            className='w-full h-[900px] rotate-45 absolute right-58 -top-20'>
            </div>
        </div>
        <div className='bg-black w-[500px] h-[300px] absolute -rotate-45 -right-44 bottom-52 rounded not-sm:hidden overflow-hidden'>
            <div
                style={{
                    backgroundImage: "url('/images/pexels-akoonie-29539887.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            className='w-full h-full absolute '>
            </div>
        </div>


        <div className='flex flex-col h-full justify-center gap-10 sm:gap-16 absolute z-40'>
            <div className='text-sm flex items-center'>
                <img 
                    src={'/images/house-sticker.jpg'}
                    className='w-20 h-20'
                />
                <p className='font-semibold'>
                    Discover the perfect bond of luxury <br /> and comfort in your new home.
                </p>
            </div>

            <div className='flex items-center gap-3'>
                <p className='font-semibold'>
                    Explore All
                    <br />Our Properties
                </p>
                <Link href={'/properties'} className='relative w-24 h-24 border-2 border-purple-950 rounded-full flex hover:animate-pulse ease-in-out'>
                    <div className='w-full h-full relative overflow-hidden rounded-full'>
                        <img 
                            src={'/images/pexels-frans-van-heerden-201846-1438832.jpg'}
                            className='absolute w-full h-full object-cover'
                        />
                    </div>
                    <span className='text-sm absolute text-white bg-purple-950 p-3 rounded-full right-0'>
                        <FaArrowRight />
                    </span>
                </Link>
            </div>

            <div className='text-5xl font-bold leading-3'>
                <p>FIND YOUR</p>
                <p>
                    <span>PERFECT</span>
                    <span className='text-6xl'> HOM<span className='text-7xl'>E</span></span>
                </p>
            </div>
        </div>

        
    </section>
  )
}
