import { useSelector } from 'react-redux'
import { selectSubtaskById, selectSubtaskIds } from './subtasksApiSlice'

const Subtask = ({ subtaskId, subtaskLength, subtasksInTask, inputId }) => {
    const subtask = useSelector(state => selectSubtaskById(state, subtaskId))
    // subtasksInTask.map(x => {
    // console.log(selectSubtaskById(subtaskId));
// })
    return (
        <div className='Subtask'>
            <input className='togglesubtask' type="checkbox" id={inputId} name="subtask" />
            <label htmlFor="subtask">{subtask.title}</label>
        </div>
    )
}

export default Subtask
