import BoardLayout from './BoardLayout' 
import ViewTask from '../features/tasks/ViewTask'
import { useNavigate, useParams } from 'react-router-dom'

const ViewTaskPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const goToBoard = () => navigate(`/board/${id}`)

    return (
        <>
            <div className="overlay" onClick={goToBoard}></div>
            <div className="taskview"> <ViewTask /> </div>
        </>
    )
}

export default ViewTaskPage