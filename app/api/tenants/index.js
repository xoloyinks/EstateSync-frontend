import { apiSlice } from "../services";

const tenantApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTenants: builder.query({
            query: () => ({
                url: '/tenants'
            })
        }),
        getTenantIssues: builder.query({
            query: (id) => ({
                url: `/issues/tenant/${id}`
            }),
            providesTags: [{ type: 'issues', id: 'TENANT' }],
        }),
        getOneTenant: builder.query({
            query: (id) => ({
                url: `/tenants/${id}`
            })
        }),
        getPaymentDetails: builder.query({
            query: (id) => ({
                url: `/tenants/payment/${id}`
            })
        }),
        getPaymentHistory: builder.query({
            query: (id) => ({
                url: `/tenants/paymentHistory/${id}`
            })
        }),
        getTenantPaymentHistory: builder.query({
            query: (id) => ({
                url: `/tenants/paymentHistory/${id}`
            })
        })

    })
});
export const { useGetTenantsQuery, useGetTenantIssuesQuery, useGetOneTenantQuery, useGetPaymentDetailsQuery, useLazyGetPaymentHistoryQuery, useGetTenantPaymentHistoryQuery } = tenantApiSlice;