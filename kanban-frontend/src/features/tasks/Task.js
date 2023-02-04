import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice'

const Task = ({ taskid, boardId, columnid }) => {
    const task = useSelector(state => selectTaskById(state, taskid))
    const navigate = useNavigate()
    const pickTask = () => navigate(`/board/${boardId}/column/${columnid}/task/${taskid}`)

    return (
        <div className='taskBox '
            onClick={pickTask}>
            <h4>{task.title}</h4>
            <p>0 of {task.subtasks.length} subtasks</p> {/* EDIT THIS LINE */}
        </div>
    )
}

export default Task