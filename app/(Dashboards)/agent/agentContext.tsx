"use client"
import React, { createContext, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie';
import { agentType, issuesType, userType } from '@/app/types';
import { useGetAgentQuery, useGetAgentsQuery, useGetMyPropertiesQuery } from '@/app/api/agents';
import { PropertyType } from '@/app/types';
import { ImSpinner9 } from 'react-icons/im';
import { useGetAgentIssuesQuery } from '@/app/api/issues';
import { useGetAdminQuery } from '@/app/api/general';
import { cn } from '@/lib/utils';

export const Properties = createContext<PropertyType[] | undefined>(undefined);
export const User = createContext<userType | undefined>(undefined)
export const AgentIssues = createContext<issuesType[] | undefined>(undefined)
export const Agent = createContext<agentType | undefined>(undefined)
export const Agents = createContext<undefined | agentType[]>(undefined);
export const Admin = createContext<undefined | userType>(undefined);


export default function AgentData({ children }: { children: React.ReactNode }): React.ReactNode {
  const [user, setUser] =  useState<userType | undefined>(undefined)
  const {data: admin, isLoading: adminLoading} = useGetAdminQuery(undefined)
  const { data: _agentsData, isLoading: agentsLoading } = useGetAgentsQuery([]);
  const [id, setId] = useState<string | undefined>(undefined)
  const { data, isLoading } = useGetMyPropertiesQuery(id, {
    skip: !id
  })
  const { data: agentIssues, isLoading: issuesLoading } = useGetAgentIssuesQuery(id, {
    skip: !id
  })
  const { data: agent, isLoading: agentLoading } = useGetAgentQuery(id, {
    skip: !id
  })

  const [properties, setProperties] = useState<PropertyType[] | undefined>()
  const [myIssues, setMyIssues] = useState<issuesType[] | undefined>();
  const [agentData, setAgentData] = useState<agentType | undefined>()
  const [agentsData, setAgentsData] = useState<agentType[] | undefined>()
  const [adminData, setAdminData] = useState<userType | undefined>(undefined)
    useEffect(() => {
        // Helper function to validate and set user data
        const updateUserFromCookie = (userString: string | undefined) => {
          if (!userString) {
            setUser(undefined);
            setId(undefined);
            return;
          }

          try {
            const parsedUser = JSON.parse(userString);
            // Validate parsedUser is an object with an id property
            if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser && typeof parsedUser.id === 'string') {
              setUser((prevUser) => {
                if (JSON.stringify(prevUser) !== JSON.stringify(parsedUser)) {
                  console.log('Updating user:', parsedUser); // Debug log
                  return parsedUser as userType;
                }
                return prevUser;
              });
              setId((prevId) => {
                if (prevId !== parsedUser.id) {
                  console.log('Updating id:', parsedUser.id); // Debug log
                  return parsedUser.id;
                }
                return prevId;
              });
            } else {
              console.warn('Invalid user data in cookie:', parsedUser);
              setUser(undefined);
              setId(undefined);
            }
          } catch (error) {
            console.error('Error parsing user cookie:', error, { userString });
            setUser(undefined);
            setId(undefined);
          }
        };

        // Check cookie immediately on mount
        updateUserFromCookie(Cookies.get('user'));
        

        // Poll for cookie changes (optional)
        const interval = setInterval(() => {
          updateUserFromCookie(Cookies.get('user'));
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
      }, []);

      useEffect(() => {
          if(data){
              setProperties(data.data)
          }
          if(agentIssues){
            setMyIssues(agentIssues.data)
          }
          if(agent){
            setAgentData(agent.data)
          }
          if(_agentsData){
            setAgentsData(_agentsData?.data)
          }
          if(admin){
            setAdminData(admin.data)
          }
      }, [data, agentIssues, agent, _agentsData, admin]);

    // console.log(myIssues)
      
    // total properties
    // total inquiring clients
    // total rents due
    // total maintenance pending

    const propertiesValue = useMemo(() => properties, [properties]);
    const issuesValue = useMemo(() => myIssues, [myIssues]);
    const agentValue = useMemo(() => agentData, [agentData]);
    const agentsValue = useMemo(() => agentsData, [agentsData]);
    const adminDataValue = useMemo(() => adminData, [adminData]);

  return (
    <section>
      <Properties.Provider value={propertiesValue}>
        <User.Provider value={user}>
          <AgentIssues.Provider value={issuesValue}>
          <Agent.Provider value={agentValue}>
            <Agents.Provider value={agentsValue}>
              <Admin.Provider value={adminDataValue}>
            {isLoading || issuesLoading || agentLoading || adminLoading || agentsLoading ? (
              <div className="w-screen h-screen bg-gray-200 absolute z-50 flex items-center justify-center">
                <ImSpinner9 className='animate-spin text-black text-2xl' />
                  </div>
                ) : (
                  children
                )}
              </Admin.Provider>
                </Agents.Provider>
          </Agent.Provider>
          </AgentIssues.Provider>
        </User.Provider>
      </Properties.Provider>
    </section>
  )
}
