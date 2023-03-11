import { useState, useEffect, useMemo } from "react"
import { useUpdateTaskMutation, useGetTasksQuery, selectTaskById } from "./tasksApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { selectAllColumns } from "../columns/columnsApiSlice"
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconcross from "../assets/icon-cross.svg";
import { selectAllSubtasks, useGetSubtasksQuery, useDeleteSubtaskMutation, useUpdateSubtaskMutation, useAddNewSubtaskMutation } from '../subtasks/subtasksApiSlice';


const EditTask = () => {
  const { backgroundColor1, textColor, backgroundColor2 } = useOutletContext();
  const { id, taskid } = useParams()
  const navigate = useNavigate()
  //BOARD
  const board = useSelector(state => selectBoardById(state, id))
  const goToBoard = () => navigate(`/board/${id}`)

  //TASK

  const task = useSelector(state => selectTaskById(state, taskid))
  console.log(task)
  // const {
  //   data: tasks,
  //   // isLoading,
  //   // isSuccess,
  //   // isError,
  //   // error
  // } = useGetTasksQuery()

  const [updateTask, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateTaskMutation()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  useEffect(() => {
    // const goToBoard2 = async() => navigate(`/board/${id}`).then(
    //   () => { window.location.reload(); })
    if (isSuccess) {
      // setSubtaskTitles([])
      setTitle('')
      setDescription('')
      setColumnId('')

      // goToBoard2()
      navigate(`/board/${id}`)
      // .then(
      //   () => { window.location.reload(); })
    }
  }, [isSuccess, navigate, id])

  const onTitleCreated = e => setTitle(e.target.value)
  const onDescriptionCreated = e => setDescription(e.target.value)


  //COLUMN  
  const columns = useSelector(selectAllColumns)


  const onColumnChosen = e => setColumnId(e.target.value)

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


  const index = fullColumnInBoard.findIndex(x => x.id === task.status)

  const [columnId, setColumnId] = useState(fullColumnInBoard[index].id)

  const columnsForMenu = fullColumnInBoard.map(column => {
    return (
      <option
        key={column.id}
        value={column.id}
      >{column.name}</option>
    )
  })


  //SUBTASK

  // const subtask = useSelector(selectAllSubtasks)

  const {
    data: substasks,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    isError: isError2,
    error: error2
  } = useGetSubtasksQuery()


  const [addNewSubtask, {
    // isLoading,
    // isSuccess,
    // isError,
    // error
  }] = useAddNewSubtaskMutation()



  const [updateSubtask,
    {
      // isLoading: isLoading2,
      // isSuccess: isSuccess2,
      // isError: isError2,
      // error: error2
    }] = useUpdateSubtaskMutation()



  const [deleteSubtask, {
    // isSuccess: isDelSuccess,
    // isError: isDelError,
    // error: delerror
  }] = useDeleteSubtaskMutation()

  // const fullsubtaskInTask = useMemo(() => [], []);
  let fullsubtaskInTask = []

  // useEffect(()=>{setSubtask([...fullsubtaskInTask])},[fullsubtaskInTask])

  // if (isLoading2) subtaskComponent = <p>Loading Columns...</p>

  // if (isError2) {
  //   subtaskComponent = <p className="errmsg">{error2?.data?.message}</p>
  // }

  // if (isSuccess2) {

  const { entities } = substasks
  const subtasksIds = Object.keys(entities).map((item => item))
  const subtaskInTask = task.subtasks.filter(i => subtasksIds.includes(i))

  subtaskInTask.map(sub => {
    if (Object.values(entities).find(obj => obj.id === sub)) {
      fullsubtaskInTask.push(Object.values(entities).find(obj => obj.id === sub))

    }
  })

  // }

  const [subtask, setSubtask] = useState([...fullsubtaskInTask])
  const [isHover, setIsHover] = useState({})

  // const [validColumnNames, setValidColumnNames] = useState(false)

  const onSubtaskNameChanged = (index, event) => {
    let data = []
    subtask.forEach((sub, i) => {
      data[i] = { ...sub }
    })
    data[index][event.target.title] = event.target.value
    setSubtask(data)
  }

  const onDeleteSubtaskClicked = async (index, event) => {
    event.preventDefault()
    if (subtask[index].id) {
      const taskId = task.id
      console.log(taskId);
      await deleteSubtask({ id: subtask[index].id, taskId, taskid })
      let data = []
      subtask.forEach((sub, i) => {
        data[i] = { ...sub }
      })
      data.splice(index, 1)
      setSubtask(data)
    } else {
      let data = []
      subtask.forEach((sub, i) => {
        data[i] = { ...sub }
      })
      data.splice(index, 1)
      setSubtask(data)
    }
  }

  const addSubtasks = (e) => {
    e.preventDefault()
    let newSubtask = { title: '' }
    setSubtask([...subtask, newSubtask])
  }
  const specialStyle = "none"
  const specialStyle2 = "inline"
  const specialStyle3 = " rgb(234, 85, 85)"

  const subtaskComponent = subtask.map((input, index) => {

    const specialStyle4 = " invert(68%) sepia(52%) saturate(5872%) hue-rotate(326deg) brightness(95%) contrast(92%)"

    const mouseOver = (event, index) => {
      setIsHover(c => {
        return {
          ...c,
          [index]: true
        };
      })
    }

    const mouseOut = (event, index) => {
      setIsHover(c => {
        return {
          ...c,
          [index]: false
        };
      })
    }
    return (
      <div className="newBoardForm2">
        <div className="inputClass" style={input.title === '' ? { borderColor: specialStyle3 } : null}>
          <input
            id="subtask"
            title="title"
            type="text"
            autoComplete="off"
            value={input.title}
            onChange={event => onSubtaskNameChanged(index, event)}
            onClick={() => { console.log(input.title) }}
            key={subtask.id}
            style={{ backgroundColor: backgroundColor1, color: textColor }}
          />
          <span
            style={input.title === '' ? { display: specialStyle2 } : { display: specialStyle }}
          >Can’t be empty</span>
        </div>
        <button
          onClick={event => onDeleteSubtaskClicked(index, event)}
          onMouseEnter={(e) => {
            mouseOver(e, index);
          }}
          onMouseLeave={(e) => {
            mouseOut(e, index);
          }}

        ><img src={iconcross} alt=""
          style={isHover[index] & input.title === '' ? { filter: specialStyle4 } : null}
          /></button>
      </div>
    )
  })

  const canSaveTask = [title, columnId].every(Boolean) && !isLoading

  const canSaveSubtask = !isLoading2

  let disabled

  if (subtask.find(o => o.title === '')) {
    disabled = true
  } else {
    disabled = false

  }
  const onformSubmited = async (e) => {
    e.preventDefault()

    if (canSaveTask
      // & canSaveSubtask
    ) {

      await updateTask({ title, description, columnId, id: taskid })

      await subtask.map(sub => {
        if (sub.id) {
          updateSubtask({ taskId: task.id, id: sub.id, title: sub.title })
        } else {
          addNewSubtask({ taskId: task.id, title: sub.title })

        }
      })
      navigate(`/board/${id}`)
    }

  }

  const errClass = isError || isError2 ? "errmsg" : "offscreen"

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <p className={errClass}>{error2?.data?.message}</p>
      <div className="overlay" onClick={goToBoard}></div>
      <form className="newBoardForm" onSubmit={onformSubmited} style={{ backgroundColor: backgroundColor1 }}>
        <h3 style={{ color: textColor }}>Edit Task</h3>
        <label htmlFor="title" style={{ color: textColor }}>Title</label>
        <div className="inputClass"
          style={title === '' ? { borderColor: specialStyle3 } : null}>

          <input
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            value={title}
            onChange={onTitleCreated}
            placeholder="e.g. Take coffee break"
            style={{ backgroundColor: backgroundColor1, color: textColor }}
          />
          <span
            style={title === '' ? { display: specialStyle2 } : { display: specialStyle }}
          >Can’t be empty</span>
        </div>

        <label htmlFor="description" style={{ color: textColor }}>Description</label>
        <textarea
          id="description"
          name="description"
          type="description"
          autoComplete="off"
          value={description}
          onChange={onDescriptionCreated}
          placeholder="e.g. It’s always good to take a break. 
          This 15 minute break will 
          recharge the batteries a little."
          style={{ backgroundColor: backgroundColor1, color: textColor }}
        />
        <label htmlFor="subtasks" className='labelSutasks' style={{ color: textColor }}
        >Subtitles</label>
        {subtaskComponent}
        <button className="lightButton" onClick={addSubtasks}>+ Add New Subtask</button>
        <label htmlFor="columns" className='labelcolumns' style={{ color: textColor }}>Status</label>
        <select id='columns' className='selectcolumns' onChange={onColumnChosen} value={columnId}
          style={{ backgroundColor: backgroundColor1, color: textColor }}>
          {columnsForMenu}
        </select>
        <button type="submit" className="darkButton" disabled={!canSaveTask || disabled
          // || !canSaveSubtask
        }
        >Save Changes</button>
      </form>
    </>
  )

  return content

}

export default EditTask
