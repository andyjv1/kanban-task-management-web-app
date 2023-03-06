import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice'
import { useGetSubtasksQuery } from '../subtasks/subtasksApiSlice'

const Task = ({ taskid, boardId, columnid, backgroundColor1, textColor }) => {
    
    const task = useSelector(state => selectTaskById(state, taskid))
    const navigate = useNavigate()
    const pickTask = () => navigate(`/board/${boardId}/column/${columnid}/task/${taskid}`)

    const {
        data: substasks,
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        isError: isError2,
        error: error2
    } = useGetSubtasksQuery()

    let content

    if (isSuccess2) {
        let fullsubtaskInTask = []
        const { entities } = substasks
        const subtaskIds = Object.keys(entities).map((item => item))
        const subtasksInTask = task.subtasks.filter(i => subtaskIds.includes(i))

        subtasksInTask.map(sub => {
            Object.values(entities).find(obj => obj.id === sub)
            if (Object.values(entities).find(obj => obj.id === sub)) {
                fullsubtaskInTask.push(Object.values(entities).find(obj => obj.id === sub))

            }
        })

        let subcheckedlegnth = 0

        fullsubtaskInTask.map(sub => {
            if (sub.isCompleted === true) {
                subcheckedlegnth++
            }
        })
        content = (
            <div className='taskBox '
                onClick={pickTask}
             style={{ backgroundColor: backgroundColor1 }}>
                <h4 style={{ color: textColor }}>{task.title}</h4>
                <p>{subcheckedlegnth} of {task.subtasks.length} subtasks</p> {/* EDIT THIS LINE */}
            </div>
        )
    }

    return content
}

export default Task