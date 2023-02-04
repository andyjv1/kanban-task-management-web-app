import BoardLayout from '../../components/BoardLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from "./boardsApiSlice"
import { useDeleteBoardMutation } from "./boardsApiSlice"

const DeleteBoard = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const board = useSelector(state => selectBoardById(state, id))

    const goToBoard = () => navigate(`/board/${id}`) 
    
        const [deleteBoard, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteBoardMutation()
    
        const onDeleteBoardClicked = async () => {
            await deleteBoard({ id: board.id })
            navigate("/board")  
        }
    
    
    const content = board ?
        (<>
            <div className="overlay" onClick={goToBoard}></div>
            <div className="deleteBoardForm">
                <h3>Delete this board?</h3>
                <p>Are you sure you want to delete the '{board.name}'
                    board? This action will remove all columns and tasks and cannot be reversed.</p>
                <div className='deleteButtons'>
                <button onClick={onDeleteBoardClicked} className="redDeleteButton">Delete</button>
                <button onClick={goToBoard} className="lightDeleteButton">Cancel</button>   
                </div>
            </div>
        </>) : <p>Loading...</p>

    return content
}

export default DeleteBoard



