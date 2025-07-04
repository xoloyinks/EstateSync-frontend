"use client"
import Input from '@/components/input'
import Nav from '@/components/nav'
import React, { useContext, useEffect, useState } from 'react'
import { FaAccusoft } from 'react-icons/fa'
import { useLoginMutation } from '@/app/api/general'
import Cookies from 'js-cookie';
import { ImSpinner9 } from "react-icons/im";
import { toast, ToastContainer } from 'react-toastify'
import { UserData } from '@/app/tokenContext'
import Loading from '@/components/isloading'

type FormData = {
    name: string
    value: string
}

export default function Login() {
   const [submitData, { data, isLoading, error }] = useLoginMutation();
   const [ active, setActive ] = useContext(UserData);
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

    const handleChange = (target: FormData) => {
        const {name, value} = target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        if (active === undefined) {
          return; 
        }
    }, [active]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await submitData(formData).unwrap();
        try{
          if(res){
                    Cookies.set('token', JSON.stringify(res.token), { expires: 1 });
                    Cookies.set('user', JSON.stringify(res.data), { expires: 1 });
                    setActive(true);
                    toast.success('Login successful', {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      theme: "dark",
                    });

                    if(res.data.role === 'admin'){
                        window.location.href = '/admin';
                    }
                    if(res.data.role === 'tenant'){
                        window.location.href = '/tenant';
                    }
                    if(res.data.role === 'agent'){
                        window.location.href = '/agent';
                    }
                    if(res.data.role === 'visitor'){
                      window.location.href = '/properties'
                    }
                    
                    // setTimeout(() => {
                    //   window.location.href = '/';
                    // }, 500);
                    
            }
        }catch(err){
            console.error("Error during login:", err);
            toast.error(`Login failed`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
            });
        }
       
    }

  return (
    <section className='w-screen h-screen'>
        <Nav />
        <ToastContainer />
       <div className='w-screen h-screen flex justify-center items-center'>
         <div className='sm:w-[25%] w-full sm:shadow-xl sm:shadow-gray-400 rounded-xl p-10 '>
            <FaAccusoft className='text-5xl' />
            <h2 className='text-2xl font-semibold'>Sign in</h2>
            <h3 className='text-xs'>Stay connected with homes around you</h3>
            <form onSubmit={handleSubmit} method='POST' className='mt-10 space-y-10'>
                <Input label='Email' onChange={handleChange} name='email' placeholder='example@gmail.com' type='email' value={formData.email} />
                <Input label='Password' onChange={handleChange} name='password' placeholder='******' type='password' value={formData.password}  />

                <button className='rounded-full bg-sky-700 p-3 text-white text-center w-full hover:cursor-pointer hover:animate-pulse flex justify-center items-center'>
                 { isLoading ? <Loading /> : 'Sign in' }
                </button>
            </form>

            <div className='text-xs mt-5 w-full text-center'>
              New to EstateSync? <a href='/signup' className='text-sky-700 font-semibold'>Join now</a> 
            </div>
        </div>
       </div>
    </section>
  )
}
