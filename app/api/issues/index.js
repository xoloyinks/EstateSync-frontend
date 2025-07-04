import { apiSlice } from "../services";

const issueApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
       getIssues: builder.query({
        query: () => ({
            url: '/issues'
        })
       }),
       postIssue: builder.mutation({
        query: (data) => ({
            url: '/issues',
            method: 'POST',
            body: {...data}
        }),
        invalidatesTags: [{ type: 'issues', id: 'TENANT' }],
       }),
       updateIssue: builder.mutation({
        query: ({id, data}) => ({
            url: `/issues/${id}`,
            method: 'PATCH',
            body: {...data}
        }),
        invalidatesTags: [{ type: 'issues', id: 'TENANT' }],
       }),
       getAgentIssues: builder.query({
        query: (id) => ({
            url: `/issues/agent/${id}`
        })
       })

    }),
    overrideExisting: true
});
export const { useGetIssuesQuery, usePostIssueMutation, useUpdateIssueMutation, useGetAgentIssuesQuery } = issueApiSlice;