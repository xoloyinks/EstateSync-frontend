"use client";
import React, { useEffect, useState, createContext, useMemo } from "react";
import { useGetAgentsQuery } from '../../api/agents/index';
import { useGetTenantsQuery } from '../../api/tenants/index';
import { useGetPropertiesQuery } from '../../api/properties/index';
import { useGetIssuesQuery } from '../../api/issues/index';
import { issuesType } from "@/app/types";
import Cookies from "js-cookie"
import { tenantsType } from "@/app/types";
import { PropertyType } from "@/app/types";
import { userType } from "@/app/types";
import { agentType } from "@/app/types";
import Loading from "@/components/isloading";
import { ImSpinner9 } from "react-icons/im";



export const Agent = createContext<null | agentType[]>(null);
export const Tenant = createContext<null | tenantsType[]>(null)
export const Property = createContext<null | PropertyType[]>(null)
export const Issue = createContext<null | issuesType[]>(null)
export const User = createContext<undefined | userType>(undefined)

export default function AdminData({ children }: { children: React.ReactNode }): React.ReactNode {
    const { data, isLoading } = useGetAgentsQuery([]);
    const { data: tenantData, isLoading: tanantLoading } = useGetTenantsQuery([])
    const { data: propertyData, isLoading: propertyLoading } = useGetPropertiesQuery(null)
    const { data: issueData, isLoading: issueLoading } = useGetIssuesQuery(null)
    const [user, setUser] = useState<userType | undefined>()

    const [agent, setAgent] = useState<null | agentType[]>(null);
    const [tenants, setTenants] = useState<null | tenantsType[]>(null)
    const [properties, setProperties] = useState<null | PropertyType[]>(null)
    const [issues, setIssues] = useState<null | issuesType[]>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            const userString = Cookies.get('user');
            let parsedUser;

            if(userString){ 
                parsedUser = JSON.parse(userString);
                setUser(parsedUser)
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [])
    
    useEffect(() => {
        if (data) {
            setAgent(data.data);
        }
        if(tenantData){
            setTenants(tenantData.data);
        }
        if(propertyData){
            setProperties(propertyData.data);
        }
        if(issueData){
            setIssues(issueData.data);
        }
    }, [data, tenantData, propertyData, issueData]);

    // Memoize context value to avoid unnecessary re-renders
    const agentValue = useMemo(() => agent, [agent]);
    const tenantValue = useMemo(() => tenants, [tenants])
    const propertyValue = useMemo(() => properties, [properties])
    const issueValue = useMemo(() => issues, [issues])

    return (
        <Agent.Provider value={agentValue}>
        <Tenant.Provider value={tenantValue}>
        <Property.Provider value={propertyValue}>
        <Issue.Provider value={issueValue}>
        <User.Provider value={user}>
             {
                isLoading || tanantLoading || propertyLoading || issueLoading ?
                <div className="w-screen h-screen bg-gray-200 absolute z-50 flex items-center justify-center">
                    <ImSpinner9 className='animate-spin text-black text-2xl' />
                </div> 
                :
                children
            }
        </User.Provider>
        </Issue.Provider>
        </Property.Provider>
        </Tenant.Provider>
        </Agent.Provider>
    );
}