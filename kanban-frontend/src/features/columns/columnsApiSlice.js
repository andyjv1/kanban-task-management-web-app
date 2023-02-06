import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const columnsAdapter = createEntityAdapter({})

const initialState = columnsAdapter.getInitialState()

export const columnsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getColumns: builder.query({
            query: () => '/column',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedColumns = responseData.map(column => {
                    column.id = column._id
                    return column
                });
                return columnsAdapter.setAll(initialState, loadedColumns)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Column', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Column', id }))
                    ]
                } else return [{ type: 'Column', id: 'LIST' }]
            }
        }),
        addNewColumn: builder.mutation({
            query: initialColumnData => ({
                url: '/column',
                method: 'POST',
                body: {
                    ...initialColumnData,
                }
            }),
            invalidatesTags: [
                { type: 'Column', id: "LIST" }
            ]
        }),
        updateColumn: builder.mutation({
            query: initialColumnData => ({
                url: '/column',
                method: 'PATCH',
                body: {
                    ...initialColumnData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Column', id: arg.id }
            ]
        }),
        deleteColumn: builder.mutation({
            query: ({ boardId, id }) => ({
                url: `/column`,
                method: 'DELETE',
                body: { boardId, id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Column', id: arg.id }
            ]
        }),
    }),
})
export const {
    useGetColumnsQuery,
    useAddNewColumnMutation,
    useUpdateColumnMutation,
    useDeleteColumnMutation,
} = columnsApiSlice

// returns the query result object
export const selectColumnsResult = columnsApiSlice.endpoints.getColumns.select()


// creates memoized selector
const selectColumnsData = createSelector(
    selectColumnsResult,
    columnsResult => columnsResult.data // normalized state object with ids & entities
)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllColumns,
    selectById: selectColumnById,
    selectIds: selectColumnIds
    // Pass in a selector that returns the columns slice of state
} = columnsAdapter.getSelectors(state => selectColumnsData(state) ?? initialState)