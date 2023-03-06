import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconVerticalEllipsis from "../assets/icon-vertical-ellipsis.svg";
import { useGetTasksQuery, useUpdateTaskMutation, selectTaskById } from './tasksApiSlice';
// import SubtasksList from '../subtasks/SubtasksList';
// import ColumnList2 from '../columns/ColumnList2';
import { useNavigate } from 'react-router-dom'
import { selectAllColumns } from "../columns/columnsApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { selectAllSubtasks, useGetSubtasksQuery, useUpdateSubtaskMutation } from '../subtasks/subtasksApiSlice';

const ViewTask = ({ textColor, backgroundColor2, backgroundColor1}) => {

    const ref = useRef()
    const navigate = useNavigate()
    const { id, taskid, columnid } = useParams()

    //BOARD    
    const board = useSelector(state => selectBoardById(state, id))

    //TASK    
    const task = useSelector(state => selectTaskById(state, taskid))

    const [editTaskBox, setEditTaskBox] = useState(true)

    const [updateTask, {
        // isLoading: isLoading3,
        // isSuccess: isSuccess3,
        // isError: isError3,
        // error: error3
    }] = useUpdateTaskMutation()

    //COLUMN    
    const columns = useSelector(selectAllColumns)

    const c = useSelector(state => state.api.queries["getColumns(undefined)"].data.entities)

    const columnIds = columns.map(s => s.id)

    const columnInBoard = board.columns.filter(i => columnIds.includes(i))

    const fullColumnInBoard = []


    columnInBoard.map(column => {
        columns.find(obj => obj.id === column)
        if (columns.find(obj => obj.id === column)) {
            fullColumnInBoard.push(columns.find(obj => obj.id === column)
            )
        }
    })

    const index = fullColumnInBoard.findIndex(x => x.id === task.status);

    const columnsForMenu = fullColumnInBoard.map(column => {
        return (
            <option
                key={column.id}
                value={column.id}
            >{column.name}</option>
        )
    })

    const [columnId, setColumnId] = useState(fullColumnInBoard[index].id)

    const onColumnChosen = async (e) => {
        setColumnId(e.target.value)
        console.log(c);
        await updateTask({ title: task.title, columnId:e.target.value, id: taskid })
        // console.log(columnId);
    }
    //SUBTASK
    const {
        data: substasks,
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        isError: isError2,
        error: error2
    } = useGetSubtasksQuery()

    const [updateSubtask, {
        // isLoading: isLoading3,
        // isSuccess: isSuccess3,
        // isError: isError3,
        // error: error3
    }] = useUpdateSubtaskMutation()

    const onSubtaskNameClicked = (index, event) => {
        let data = []
        subtask.forEach((sub, i) => {
            data[i] = { ...sub }
        })
        data[index][event.target.title] = event.target.value
        setSubtask(data)
        return fullsubtaskInTask
    }

    let subtaskComponent
    let subtaskLabel


    let fullsubtaskInTask = []
    // const fullsubtaskInTask = useMemo(() => [], []);



    if (isLoading2) subtaskComponent = <p>Loading Columns...</p>

    if (isError2) {
        subtaskComponent = <p className="errmsg">{error2?.data?.message}</p>
    }

    if (isSuccess2) {
        const { entities } = substasks
        const subtaskIds = Object.keys(entities).map((item => item))
        const subtasksInTask = task.subtasks.filter(i => subtaskIds.includes(i))

        subtasksInTask.map(sub => {
            Object.values(entities).find(obj => obj.id === sub)
            if (Object.values(entities).find(obj => obj.id === sub)) {
                fullsubtaskInTask.push(Object.values(entities).find(obj => obj.id === sub))

            }
        })
        // console.log(substasks);

    }
    // setSubtaskMap(...fullsubtaskInTask)
    const [subtask, setSubtask] = useState([fullsubtaskInTask])

    const handleActive = async (index, event) => {
        // event.preventDefault()
        // setSubtask([...fullsubtaskInTask])
        await updateSubtask({ isCompleted: !fullsubtaskInTask[index].isCompleted, taskId: taskid, id: fullsubtaskInTask[index].id, title: fullsubtaskInTask[index].title })

        // let data = []
        // subtask.forEach((sub, i) => {
        //     data[i] = { ...sub }
        // })
        // data[index].isCompleted = !data[index].isCompleted
        // setSubtask(data)
    };

    let inputClass
    backgroundColor1 ? inputClass="darkinput": inputClass="togglesubtask"

    subtaskComponent = fullsubtaskInTask.map((subtask, index) => {
        return (
            <div className='Subtask' style={{ backgroundColor: backgroundColor2 }}>
                <input
                    className={inputClass}
                    type="checkbox"
                    id={index}
                    name="subtask"
                    onChange={event => handleActive(index, event)}
                    key={subtask.id}
                    value={subtask.title}
                    checked={subtask.isCompleted}
                />
                <label htmlFor="subtask" style={{ color: !subtask.isCompleted ? textColor: "rgb(130, 143, 163)" }}>{subtask.title}</label>
            </div>
        )
    })

    const sublength = fullsubtaskInTask.length
    let subcheckedlegnth = 0

    fullsubtaskInTask.map(sub => {
        if (sub.isCompleted === true) {
            subcheckedlegnth++
        }
    })

    subtaskLabel = `Subtasks (${subcheckedlegnth} of ${sublength})`

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

    // const onColumnChosen = e => setColumnId(e.target.value)


    // const onformSubmited = async (e) => {

    //     // const canSaveTask = !isLoading3

    //     // console.log(columnId);
    //     // if (canSaveTask) {
    //     await updateTask({ title: task.title, columnId:e.target.value, id: taskid })
    //     // }

    // }
    let content

    // if (isLoading) content = <p>Loading Tasks...</p>

    // if (isError) {
    //     content = <p className="errmsg">{error?.data?.message}</p>
    // }

    const onVerticalIconClicked = () => { setEditTaskBox(!editTaskBox) }


    // if (isSuccess) {

    content = (
        <>
            <div className='taskandellipsis'>
                <h2 style={{ color: textColor, paddingBottom: task.description ? "1.7rem" : "0" }}>{task.title}</h2>
                <img src={iconVerticalEllipsis} alt="" onClick={onVerticalIconClicked} />
            </div>
            <div className='editTaskBox' ref={ref} style={{ display: editTaskBox ? "none" : "flex" , backgroundColor: backgroundColor2}}>
                <p className='greyP' onClick={() => { navigate(`/board/${id}/column/${columnid}/task/${taskid}/edittask`) }}>Edit Task</p>
                <p className='redP' onClick={() => { navigate(`/board/${id}/column/${columnid}/task/${taskid}/deletetask`) }}>Delete Task</p>
            </div>
            <h3>{task.description}</h3>
            <label htmlFor="subtasks"
                className='labelSutasks'
            style={{ color: textColor }}>{subtaskLabel}</label>{/* To change */}
            {subtaskComponent}
            <label htmlFor="columns"
                className='labelcolumns'
            style={{ color: textColor }}>Current Status</label>
            <select id='columns'
                className='selectcolumns' 
                value={columnId} 
                onChange={onColumnChosen}
                style={{ backgroundColor: backgroundColor2, color: textColor }}
            >
                {columnsForMenu}
            </select>
            
        </>
    )
    // }

    return content


}

export default ViewTask
