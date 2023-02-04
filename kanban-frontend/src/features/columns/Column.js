import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectColumnById } from './columnsApiSlice'
import TasksList from '../tasks/TasksList'
const Column = ({ columnid, boardId }) => {
    const column = useSelector(state => selectColumnById(state, columnid))

    if (column) {
        return (
            <div className="columnscontainer">
                <div className="columnName">
                    <span></span>
                    <p>{column.name}</p>
                    <p>({column.tasks.length})</p>
                </div>
                <TasksList columnid={columnid} boardId={boardId} />
            </div>
        )

    } else return null
}

export default Column