import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectColumnById } from './columnsApiSlice'
import TasksList from '../tasks/TasksList'
const Column = ({ columnid, boardId }) => {
    const column = useSelector(state => selectColumnById(state, columnid))

    if (column) {
        return (
            < >
                <option value={column.name}>{column.name}</option>
            </>
        )

    } else return null
}

export default Column