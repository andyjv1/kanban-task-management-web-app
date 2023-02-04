import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice';
import iconVerticalEllipsis from "../assets/icon-vertical-ellipsis.svg";
import { useGetTasksQuery } from './tasksApiSlice';
import SubtasksList from '../subtasks/SubtasksList';
import ColumnList2 from '../columns/ColumnList2';
import { useNavigate } from 'react-router-dom'

const ViewTask = () => {

    const ref = useRef()

    const navigate = useNavigate()

    const [editTaskBox, setEditTaskBox] = useState(true)

    useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (!editTaskBox && ref.current && !ref.current.contains(e.target)) {
        setEditTaskBox(true)
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [editTaskBox])
    const { id, taskid, columnid } = useParams()
    // console.log(taskid);
    const task = useSelector(state => selectTaskById(state, taskid))
    // console.log(task);

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTasksQuery()

    //   console.log(tasks)

    let content

    if (isLoading) content = <p>Loading Tasks...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

        const onVerticalIconClicked = () => {setEditTaskBox(!editTaskBox)}


    if (isSuccess) {

        content = (
            <>
                <div className='taskandellipsis'>
                    <h3>{task.title}</h3>
                    <img src={iconVerticalEllipsis} alt="" onClick={onVerticalIconClicked}/>
                </div>

                <div className='editTaskBox' ref={ref} style={{ display: editTaskBox ? "none" : "flex" }}>
                    <p className='greyP' onClick={()=>{navigate(`/board/${id}/column/${columnid}/task/${taskid}/edittask`)}}>Edit Board</p>
                    <p className='redP' onClick={()=>{navigate(`/board/${id}/column/${columnid}/task/${taskid}/deletetask`)}}>Delete Board</p>
                </div>
                <h3>{task.description}</h3>
                <label htmlFor="subtasks" className='labelSutasks'>Subtasks (2 of 3)</label>{/* To change */}
                <SubtasksList inputId={ "subtasks"} taskid={taskid} />
                <label htmlFor="columns" className='labelcolumns'>Current Status</label>
                <select id='columns' className='selectcolumns'>
                    <ColumnList2 />
                </select>
            </>
        )
    }

    return content


}

export default ViewTask
