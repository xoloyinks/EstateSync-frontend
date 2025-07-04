import { apiSlice } from "../services";

const agentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // create agent
        createAgent: builder.mutation({
            query: (formData) => ({
                url: "/agents/add",
                method: "POST",
                body: formData
            })
        }),
        // get agent
        getAgents: builder.query({
            query:() => ({
                url:  '/agents'
            })
        }),
        getMyProperties: builder.query({
            query: (id) => ({
                url: `/agents/properties/${id}`
            })
        }),
        getAgent: builder.query({
            query: (id) => ({
                url: `/agents/${id}`
            })
        })
    })
});
export const { useCreateAgentMutation, useGetAgentsQuery, useGetMyPropertiesQuery, useGetAgentQuery } = agentApiSlice;