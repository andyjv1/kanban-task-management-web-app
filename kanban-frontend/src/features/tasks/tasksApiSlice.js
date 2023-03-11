import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const tasksAdapter = createEntityAdapter({})

const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTasks: builder.query({
            query: () => '/task',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedTasks = responseData.map(task => {
                    task.id = task._id
                    return task
                });
                return tasksAdapter.setAll(initialState, loadedTasks)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Task', id }))
                    ]
                } else return [{ type: 'Task', id: 'LIST' }]
            }
        }),
        addNewTask: builder.mutation({
            query: initialTaskData => ({
                url: '/task',
                method: 'POST',
                body: {
                    ...initialTaskData,
                }
            }),
            invalidatesTags: [
                { type: 'Task', id: "LIST" }
            ]
        }),
        updateTask: builder.mutation({
            query: initialTaskData => ({
                url: '/task',
                method: 'PATCH',
                body: {
                    ...initialTaskData,
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [
                    // since the column model contains the task model
                    // when updating the task the column should be invalidated
                    { type: 'Column', id: arg.columnId }
                ]
            }
        }),
        deleteTask: builder.mutation({
            query: ({ id, columnId }) => ({
                url: `/task`,
                method: 'DELETE',
                body: { id, columnId }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Task', id: arg.id }
            ]
        }),
    }),
})
export const {
    useGetTasksQuery,
    useAddNewTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = tasksApiSlice

// returns the query result object
export const selectTasksResult = tasksApiSlice.endpoints.getTasks.select()


// creates memoized selector
const selectTasksData = createSelector(
    selectTasksResult,
    tasksResult => tasksResult.data // normalized state object with ids & entities
)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds
    // Pass in a selector that returns the tasks slice of state
} = tasksAdapter.getSelectors(state => selectTasksData(state) ?? initialState)