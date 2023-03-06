import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectColumnById } from './columnsApiSlice'
import TasksList from '../tasks/TasksList'
const Column = ({ columnid, boardId, backgroundColor1, textColor }) => {
    const column = useSelector(state => selectColumnById(state, columnid))
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
    if (column) {
        return (
            <div className="columnscontainer">
                <div className="columnName">
                    <span style={{backgroundColor:`#${randomColor}`}}></span>
                    <p>{column.name}</p>
                    <p>({column.tasks.length})</p>
                </div>
                <TasksList columnid={columnid} boardId={boardId} backgroundColor1={backgroundColor1}
                textColor={textColor}/>
            </div>
        )

    } else return null
}

export default Column