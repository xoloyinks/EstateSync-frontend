"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { usePathname } from 'next/navigation';
import "swiper/css/navigation";
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css';
import 'swiper/css/effect-cards';
import Image from 'next/image';
import { HiMiniHomeModern } from "react-icons/hi2";
import { FaMapPin, FaTrash } from 'react-icons/fa6';
import { FaUserTie } from 'react-icons/fa';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import { PropertyType, userType } from '@/app/types';
import { TbCurrencyNaira } from "react-icons/tb";
import { toast } from 'react-toastify';

export default function Property({ images, description, price, location, bedrooms, agent, title, mode, id, acquired, role }: PropertyType) {
  const pathName = usePathname();
  const isAgentUrl = pathName.includes('/agent');
  const isAdminUrl = pathName.includes('/admin');
  const verifiedTenant: userType | undefined = acquired;
  const route = useRouter()

  // console.log(title, acquired)

  const handleProperty = (propertyObject: PropertyType) => {
    Cookies.set('Property', JSON.stringify(propertyObject));
    if(isAgentUrl){
      route.push('/agent/properties/details');
    }else if(isAdminUrl){
      route.push('/admin/properties/details');
    }else{
      route.push('/properties/details');
    }
  }

   let token = Cookies.get("token")?.trim();
     if(token){
        token = token.replace(/^"|"$/g, "");
     }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the ${title} property?`)) {
      const backendUrl = process.env.NEXT_PUBLIC_NODE_ENV === "development" ?  'http://localhost:3001/api' : process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        if (!token) {
          alert('You are not authorized to delete this property');
          return;
        }

        const res = await fetch(`${backendUrl}/properties/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
          console.log('Profile deleted successfully:', data);
              toast.success(`${title} Deleted!`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
              
    }catch(error){
        console.error('Error deleting property:', error);
        alert('An error occurred while deleting the property');
        return;
    }
  }
}

  return (
    <div className=' not-sm:w-[90%] not-sm:mx-auto w-[350px] h-[500px] rounded-2xl shadow-2xl shadow-gray-400 overflow-hidden hover:scale-105 transition-all ease-in-out hover:shadow-gray-600 border-gray-500'>
        <div className='w-full h-[300px] relative overflow-hidden'>
           {role === 'admin' && 
            <button onClick={() => handleDelete()} className='bg-black/10 absolute top-5 right-5 p-3 rounded-full z-20'>
              <FaTrash className='text-red-300 hover:text-red-500' />
            </button>}
            <Swiper
                      spaceBetween={0}
                      modules={[Autoplay, Pagination, Navigation]} 
                      slidesPerView={1}
                      effect={"autoplay"}
                      // navigation={true}
                      pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet custom-bullet',
                            bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
                      }}
                      speed={500}
                      autoplay= {{
                          delay: 10000,
                          disableOnInteraction: false,
                      }}
                      className='w-full h-full'
                      >
                      {images.map((el : string, i : number) => {
                          return <SwiperSlide key={i} className="w full h-full relative">
                            <Image src={el} alt={`Slide ${i} `} fill className="object-cover" />
                            </SwiperSlide>;
                      })}
            </Swiper>
        </div>
        <div onClick={() => handleProperty({ images, description, price, location, bedrooms, agent, title, mode, id, acquired })} className='h-full w-full p-3 space-y-3 relative cursor-pointer'>
            
           <div className='flex justify-between'>
              {/* Descriptioin */}
              <div className='description text-sm w-[70%] text-left'>
                  {title.length > 50 ?
                    <p>{title.slice(0, 50)}...</p> :
                    <p>{title}</p>
                  }
              </div>
              <div className='flex flex-col'>
                <span className='flex items-center text-xs font-semibold'><TbCurrencyNaira /> {Number(price).toLocaleString()}</span>
                <span className='bg-green-200 text-[7px] text-green-600 p-1 font-semibold text-center rounded'>{mode}</span>
              </div>
           </div>

           <div className='flex items-center gap-2 text-xs'>
              <FaMapPin />
              <span>{location}</span>
           </div>

           <div className='flex items-center gap-1 bg-gray-100 text-gray-400 text-[12px] p-1 rounded w-fit'>
              <HiMiniHomeModern />
              <span>{bedrooms} Bedrooms</span>
           </div>
          
          {/* Agent */}
          {
            !isAgentUrl ?
              <div className='flex border-t-2 border-gray-300 items-center gap-2'>
                  <div className='relative w-14 h-14 mt-1'>
                    <Image fill alt='Agent Image' src={agent.image} className='border-2 border-gray-300 w-full h-full rounded-full object-cover' />
                  </div>
                  <div className=' text-xs space-y-1'>
                        <p className='font-semibold text-gray-600'>{agent.last_name} {agent.first_name}</p>
                        <p className='flex items-center gap-2 text-gray-500'>
                          <span><FaUserTie /></span>
                          <span>Agent</span>
                        </p>
                  </div>
              </div> : verifiedTenant ?
              <div className='flex border-t-2 border-gray-300 items-center gap-2'>
                  <div className='relative w-14 h-14 mt-1'>
                    <img alt='Agent Image' src={verifiedTenant.image} className='border-2 border-gray-300 w-full h-full rounded-full object-cover' />
                  </div>
                  <div className=' text-xs space-y-1'>
                        <p className='font-semibold text-gray-600'>
                          <span>{verifiedTenant.last_name} {verifiedTenant.first_name}</span>
                        </p>
                        <p className='flex items-center gap-2 text-gray-500'>
                          <span><FaUserTie /></span>
                          <span>Tenant</span>
                        </p>
                  </div>
              </div> :
              <div className='text-[10px] p-2 bg-green-300 text-green-700 w-fit rounded-xl mt-5'>
                Available
              </div>
          } 
        </div>
        
    </div>
  )
}
