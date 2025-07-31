"use client"
import Nav from '@/components/nav'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import {  FaPen } from 'react-icons/fa'
import pp from '@/public/images/no-image.jpg'
import Input from '@/components/input'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import Loading from '@/components/isloading'

export default function Signup() {
    const [loading, setLoading ] = useState(false);
    const route = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [fileObj, setFileObj] = useState<File | null>(null)
    const [profileImage, setProfileImage] = useState<string | undefined>()
    const [showPass, setShowPass] = useState(false)
    const createAccount: FormData = new FormData();
    const [formData, setFormData] = useState({
        image: pp,
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        gender: 'male',
    });

        useEffect(() => {
        if (fileObj) {
            const imageUrl = URL.createObjectURL(fileObj);
            setProfileImage(imageUrl);
            
            // Cleanup the object URL after component unmounts or file changes
            return () => URL.revokeObjectURL(imageUrl);
        }

    }, [fileObj]);

    useEffect(() => {
        if(typeof window !== 'undefined'){
          return
        }
    }, []);

    const handleButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(fileInputRef.current === null){
            return;
        }
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files === null || event.target.files.length === 0){
            return;
        }
        createAccount.append('image', event.target.files[0])
        setFileObj(event.target.files[0])
    };

    const handleChange = (target: {name: string, value:string}) => {
        const {name, value} = target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    let token = Cookies.get("token")?.trim();
         if(token){
            token = token.replace(/^"|"$/g, "");
         }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const password = formData.password;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be at least 8 characters, contain an uppercase letter, a number, and a symbol.",
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                }
            );
            return;
        }

        if(formData.password !== formData.confirm_password){
            toast.error(`Passwords do not match!`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return;
        }
        createAccount.append('first_name', formData.first_name);
        createAccount.append('last_name', formData.last_name);
        createAccount.append('phone_number', formData.phone_number);
        createAccount.append('email', formData.email);
        createAccount.append('password', formData.confirm_password);
        createAccount.append('gender', formData.gender);
        createAccount.append('role', 'visitor')
        if(fileObj){
            createAccount.append('image', fileObj);
        }else{
            console.log("Image not captured!")
        }

         const backendUrl = process.env.NEXT_PUBLIC_NODE_ENV === "development" ?  process.env.NEXT_PUBLIC_BACKEND_URL : process.env.NEXT_PUBLIC_RENDER_BACKEND_URL;

        try{
            setLoading(true);
                const res = await fetch(`${backendUrl}/auth/createAccount`, {
                    method: 'POST', 
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                    body: createAccount, 
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

            if(res){
            toast.success('Account created Successfully!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                });

                setTimeout(() => {
                    route.push('/login')
                }, 500)
            }

        }catch(e){
            console.error("Error during account creation:", e);
            toast.error(`Account creation failed`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }finally{
            setLoading(false)
        }
        // for (const [key, value] of createAccount.entries()){
        //     console.log(`${key}: `, value)
        // }
    } 
  return (
    <section className='w-screen h-screen'>
        <ToastContainer />
        <Nav />
        <div className='flex justify-center items-center w-screen h-screen'>
            <div className='sm:w-[40%] w-full sm:shadow-xl sm:shadow-gray-400 rounded-xl p-10 mt-56 '>
                {/* <FaAccusoft className='text-5xl' /> */}
                <h2 className='text-2xl font-semibold'>Sign up</h2>
                <h3 className='text-xs'>Stay connected with homes around you</h3>

                <form onSubmit={handleSubmit} method="post" className='mt-10'>
                    <div className='relative w-fit'>
                        <div className='w-[150px] h-[150px] rounded-full shadow-xl shadow-gray-300 relative overflow-hidden'>
                            {
                                formData.image && (
                                <Image
                                alt='Image here..'
                                src={formData.image}
                                fill
                                className='object-cover'
                            />)
                            }
                            {
                                profileImage && (
                                    <Image
                                        alt=' Image'
                                        src={profileImage}
                                        fill
                                        className='object-cover'
                                    />
                                )
                            }
                            {
                                !formData.image && !profileImage && (
                                    <Image
                                        alt=' Image'
                                        src={pp}
                                        fill
                                        className='object-cover'
                                    />
                                )
                            }
                        </div>
                        <div className='w-full flex justify-center -translate-y-4'>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange} 
                            />
                            <button onClick={handleButtonClick} className='p-2 rounded-full bg-sky-700 text-white hover:cursor-pointer absolute right-5'>
                                <FaPen />
                            </button>
                        </div>
                    </div>
                    
                    <div className='mt-10 space-y-5'>
                        <div className='sm:flex justify-between'>
                            <div className='sm:w-[47%]'>
                                <Input label='First name' placeholder='John' value={formData.first_name} name='first_name' onChange={handleChange} />
                            </div>
                             <div className='sm:w-[47%] not-sm:mt-5'>
                                <Input label='Last name' placeholder='Doe' value={formData.last_name} name='last_name' onChange={handleChange} />
                            </div>
                        </div>

                        <div className='sm:flex justify-between'>
                            <div className='sm:w-[47%]'>
                                <Input label='Email' placeholder='example@gmail.com' value={formData.email} name='email' onChange={handleChange} />
                            </div>
                             <div className='sm:w-[47%] not-sm:mt-5'>
                                <Input label='Phone number' placeholder='0923327323' value={formData.phone_number} name='phone_number' onChange={handleChange} />
                            </div>
                        </div>

                        <div className='w-full flex-col'>
                            <label  className='text-sm font-semibold' htmlFor="gender">Gender</label>
                            <br />
                            <select className='border-gray-500 border-b mt-1 w-full' value={formData.gender} name="gender" onChange={e => handleChange({ name: "gender", value: e.target.value })}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className='sm:flex justify-between'>
                            <div className='sm:w-[47%]'>
                                <Input label='Password' type={showPass ? 'text' : 'password'} placeholder='*********' value={formData.password} name='password' onChange={handleChange} />
                            </div>
                             <div className='sm:w-[47%] not-sm:mt-5'>
                                <Input label='Confirm Password' type={showPass ? 'text' : 'password'} placeholder='*******' value={formData.confirm_password} name='confirm_password' onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className='text-xs mt-3 sm:flex gap-1 items-center'>
                        <input type='checkbox' checked={showPass} onChange={() => setShowPass(!showPass)} />
                        Show password
                    </div>

                     <button disabled={loading} className='rounded-full bg-sky-700 p-3 mt-5 text-white text-center flex items-center justify-center w-full hover:cursor-pointer hover:animate-pulse'>
                        { loading ? <Loading /> : 'Sign up' }
                    </button>
                </form>
            </div>
        </div>
    </section>
  )
}
