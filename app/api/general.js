import { apiSlice } from "./services";

const generalApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: {...credentials},
            }),
        }),
        createAccount: builder.mutation({
            query: (formData) => ({
                url: '/auth/createAccount',
                method: 'POST',
                body: formData
            })
        }),
        updateAccount: builder.mutation({
            query: (formData) => ({
                url: '/users/update',
                method: 'PATCH',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }), 
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/users/updatePassword',
                method: 'PATCH',
                body: {...data}
            })
        }),
        getIssues: builder.query({
            query: () => ({
                url: `/issues`
            })
        }),
        sumbitApplication: builder.mutation({
            query: (formData) => ({
                url: '/applications',
                method: 'POST',
                body: formData
            })
        }),
        getApplication: builder.query({
            query: (id) => ({
                url:  `/applications/${id}`
            }),
            providesTags: ['Applications']
        }),
        getApplications: builder.query({
            query: () => ({
                url: '/applications',
            }),
            providesTags: ['Applications']
        }),
        approveApplication: builder.mutation({
            query: ({ id, status }) => ({
                url: `/applications/approve/${id}`,
                method: 'PATCH',
                body: { id, status }
            }),
            invalidatesTags: ['Applications']
        }),
         rejectApplication: builder.mutation({
            query: ({ id, status }) => ({
                url: `/applications/reject/${id}`,
                method: 'PATCH',
                body: { id, status }
            }),
            invalidatesTags: ['Applications']
        }),
        getAdmin: builder.query({
            query: () => ({
                url: '/users/admin'
            })
        }),
        subscribe: builder.mutation({
            query: (data) => ({
                url: '/subscription',
                method: 'POST',
                body: {...data}
            })
        }),
        getAllPaymentHistories: builder.query({
            query: () => ({
                url: '/subscription/paymentHistory'
            }),
        })
    }),
    overrideExisting: true
});
export const { useLoginMutation, useCreateAccountMutation, useUpdateAccountMutation, useChangePasswordMutation, useGetIssuesQuery, useSumbitApplicationMutation, useGetApplicationQuery, useGetApplicationsQuery, useGetAdminQuery, useApproveApplicationMutation, useRejectApplicationMutation, useSubscribeMutation, useGetAllPaymentHistoriesQuery } = generalApiSlice;