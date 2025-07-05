"use client";
import { useChangePasswordMutation } from '@/app/api/general';
import React, { useContext, useEffect, useState } from 'react'
import { MdLock } from 'react-icons/md';
import { User } from '../tenantContext';
import Loading from '@/components/isloading';
import { toast, ToastContainer } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';


// Type guard to check if error is FetchBaseQueryError
const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return (error as FetchBaseQueryError).status !== undefined;
};

// Type for error.data (adjust based on your backend response)
type ErrorData = {
  message?: string;
};

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [ submitData, { isLoading, error: myError, isError } ] = useChangePasswordMutation();
  const user = useContext(User);
  let email: string;
  if(user){
    email = user.email
  } 

      useEffect(() => {
        if (isError && myError) {
          if (isFetchBaseQueryError(myError)) {
            const errorData = myError.data as ErrorData | undefined;
            toast.error(errorData?.message, {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              theme: "dark",
              });
          } else {
            console.log('myError:', 'Serialized error occurred');
          }
        }

      }, [isError])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!current || !newPass || !confirm) {
      setError('All fields are required.');
      return;
    }
    if (newPass !== confirm) {
      setError('New passwords do not match.');
      return;
    }

    if(newPass === current){
      setError("New password cannot be the old password")
      return;
    }
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    
            if (!passwordRegex.test(newPass)) {
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
    
    try{
      const res = await submitData({ email, current_password: current, new_password: newPass }).unwrap();
      if(res){
          toast.success('Password Changed', {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              theme: "dark",
          });
      }

      setCurrent('')
      setNewPass('')
      setConfirm('')
    }catch(err){
      console.error(err)
    }

  };

  return (
    <div className="max-w-md mx-auto mt-20 sm:mt-10 bg-white p-8 rounded-xl shadow-2xl relative">
      <ToastContainer />
      <div className='text-6xl bg-white text-gray-400 w-fit p-5 rounded-full absolute -top-[15%] shadow-xl shadow-gray-100'>
                <MdLock />
      </div>
      <div className='mt-10'>
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <form className="space-y-5 text-sm" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  className="w-full border rounded px-3 py-2 pr-10"
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShow(s => ({ ...s, current: !s.current }))}
                >
                  {show.current ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={show.newPass ? "text" : "password"}
                  className="w-full border rounded px-3 py-2 pr-10"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShow(s => ({ ...s, newPass: !s.newPass }))}
                >
                  {show.newPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  className="w-full border rounded px-3 py-2 pr-10"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                >
                  {show.confirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <button
              type="submit"
              className="w-full bg-sky-700 text-white py-2 rounded font-semibold hover:bg-sky-800 transition flex justify-center"
            >
              { isLoading ? <Loading /> : 'Change Password' }
            </button>
          </form>
      </div>
    </div>
  );
}