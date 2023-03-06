import ViewTask from '../features/tasks/ViewTask'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'

const ViewTaskPage = () => {
const { backgroundColor1, textColor, backgroundColor2 } = useOutletContext(); // <-- access context value

    const { id } = useParams()
    const navigate = useNavigate()
    const goToBoard = () => navigate(`/board/${id}`)

    return (
        <>
            <div className="overlay" onClick={goToBoard}></div>
            <div className="taskview" style={{ backgroundColor: backgroundColor1 }}>
                <ViewTask
                    textColor={textColor}
                    backgroundColor2={backgroundColor2}
                    backgroundColor1={backgroundColor1}
            /> </div>
        </>
    )
}

export default ViewTaskPage