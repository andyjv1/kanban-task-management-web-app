import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice' 
import { useDeleteTaskMutation } from './tasksApiSlice'

const DeleteTask = () => {
    const { backgroundColor1, textColor, backgroundColor2 } = useOutletContext(); 

    const { id, taskid, columnid } = useParams()
    const navigate = useNavigate()
    const task = useSelector(state => selectTaskById(state, taskid))

    const columnId = columnid

    const goToBoard = () => navigate(`/board/${id}`)    
    
        const [deleteTask, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteTaskMutation()
    
        const onDeleteTaskClicked = async () => {
            console.log(columnId);
            console.log(id);
            await deleteTask({ id:task.id, columnId })
            navigate(`/board/${id}`)  
        }
    
    
    const content = task ?
        (<>
            <div className="overlay" onClick={goToBoard}></div>
            <div className="deleteBoardForm" style={{ backgroundColor: backgroundColor1 }}>
                <h3>Delete this task?</h3>
                <p>Are you sure you want to delete the '{task.title}'
                    task? This action cannot be reversed.</p>
                <div className='deleteButtons'>
                <button onClick={onDeleteTaskClicked} className="redDeleteButton">Delete</button>
                <button onClick={goToBoard} className="lightDeleteButton">Cancel</button>   
                </div>
            </div>
        </>) : <p>Loading...</p>

    return content
}

export default DeleteTask