"use client";
import { useGetOneTenantQuery, useGetPaymentDetailsQuery, useGetPaymentHistoryQuery, useGetTenantIssuesQuery } from '@/app/api/tenants';
import { issuesType, PaymentType, tenantsType, userType } from '@/app/types';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import Loading from '@/components/isloading';
import Cookies from 'js-cookie';
import { useGetAdminQuery } from '@/app/api/general';
import { ImSpinner9 } from 'react-icons/im';

// Define Tenant context
export const Tenant = createContext<tenantsType | null>(null);
export const User = createContext<userType | undefined>(undefined)
export const Issue = createContext<null | issuesType[]>(null)
export const Admin = createContext<undefined | userType>(undefined);
export const Payment = createContext<undefined | PaymentType>(undefined)
export const PaymentHistory = createContext<PaymentType[] | undefined>([]);


export default function TenantData({ children }: { children: React.ReactNode }): React.ReactNode {
  // Safely retrieve user ID from cookie
  const [user, setUser] = useState<userType | undefined>()
  const [id, setId] = useState<string | undefined>()
  const {data: admin, isLoading: adminLoading} = useGetAdminQuery(undefined)

  // Fetch issues and tenant data
  const { data: issuesData, isLoading: issuesLoading, error: issuesError } = useGetTenantIssuesQuery(id, {
    skip: !id, // Skip query if id is null
  });
  const { data: tenantData, isLoading: tenantLoading, error: tenantError } = useGetOneTenantQuery(id, {
    skip: !id, // Skip query if id is null
  });
  const { data: paymentData, isLoading: paymentLoading } = useGetPaymentDetailsQuery(id, {
    skip: !id
  })
  const { data: paymentHistoryData, isLoading: paymentHistoryLoading } = useGetPaymentHistoryQuery(id, {
    skip: !id
  });
  const [issues, setIssues] = useState<issuesType[] | null>(null);
  const [tenant, setTenant] = useState<tenantsType | null>(null);
  const [adminData, setAdminData] = useState<userType | undefined>(undefined)
  const [payment, setPayment] = useState<PaymentType>()
  const [paymentHistory, setPaymentHistory] = useState<PaymentType[] | undefined>([]);
  

  useEffect(() => {
          const interval = setInterval(() => {
              const userString = Cookies.get('user');
              let parsedUser: userType | undefined;
  
              if(userString){ 
                  parsedUser = JSON.parse(userString);
                  if(parsedUser){
                    setId(parsedUser.id)
                    setUser(parsedUser)
                  }
              }
          }, 1000);
  
          return () => clearInterval(interval);
      }, [])

  useEffect(() => {
    if (issuesData?.data) {
      setIssues(issuesData.data);
    }
    if (tenantData?.data) {
      setTenant(tenantData.data);
    }
    if(admin){
      setAdminData(admin.data)
    }
    if(paymentData){
      setPayment(paymentData.data)
    }
    if(paymentHistoryData){
      setPaymentHistory(paymentHistoryData.data)
    }
    
  }, [issuesData, tenantData, user, admin, paymentData, paymentHistoryData]);

  const issuesValue = useMemo(() => issues, [issues]);
  const tenantValue = useMemo(() => tenant, [tenant]);
  const adminDataValue = useMemo(() => adminData, [adminData]);
  const paymentValue = useMemo(() => payment, [payment]);
  const paymentHistoryValue = useMemo(() => paymentHistory, [paymentHistory]);
  
  // console.log(paymentHistoryValue)

  return (
    <section>
      <Issue.Provider value={issuesValue}>
        <Tenant.Provider value={tenantValue}>
            <User.Provider value={user}>
                <Admin.Provider value={adminDataValue}>
                  <Payment.Provider value={paymentValue}>
                <PaymentHistory.Provider value={paymentHistoryValue}>
                {/* Show loading state if data is still being fetched */}
                {issuesLoading || tenantLoading || adminLoading || paymentLoading || paymentHistoryLoading ? (
                    <div className="w-screen h-screen bg-gray-200 absolute z-50 flex items-center justify-center text-sky-700 flex-col">
                      <ImSpinner9 className='animate-spin text-2xl' />
                      <p>Loading...</p>
                    </div>
                ) : (
                    children
                )}
                </PaymentHistory.Provider>
                </Payment.Provider>
                </Admin.Provider>
          </User.Provider>
        </Tenant.Provider>
      </Issue.Provider>
    </section>
  );
}