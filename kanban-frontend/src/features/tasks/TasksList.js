import { useGetTasksQuery } from './tasksApiSlice';
import Task from './Task';
import { useSelector } from 'react-redux'
import { selectColumnById } from '../columns/columnsApiSlice';

const TasksList = ({ columnid, boardId, backgroundColor1, textColor }) => {

    //observing the state in cache (if does not exist in cache it fetches from remote (REST API))
    const column = useSelector(state => selectColumnById(state, columnid))

    const {
        data: tasks,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTasksQuery()

    let content

    if (isLoading) content = <p>Loading Tasks...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = tasks

        const tasksInBoard = column.tasks.filter(i => ids.includes(i))

        const tasksNewContent = tasksInBoard?.length
            ? tasksInBoard.map(taskid => <Task key={taskid} taskid={taskid} boardId={boardId} columnid={columnid} backgroundColor1={backgroundColor1}
                textColor={textColor} />)
            : null

        content = (
            <> {tasksNewContent} </>
        )
    }

    return content


}

export default TasksList