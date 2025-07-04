import { apiSlice } from "../services";

const base = 'properties'
const propertyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProperties: builder.query({
            query: () => ({
                url: `/${base}`
            })
        }), 
        getProperty: builder.query({
            query: (id) => ({
                url:`/${base}/${id}`
            })
        }),
        createProperties: builder.mutation({
            query: (formData) => ({
                url: `/${base}/createProperty`,
                method: 'POST',
                body: formData
            })
        }),
    })
});
export const { useGetPropertiesQuery, useCreatePropertiesMutation, useGetPropertyQuery } = propertyApiSlice;