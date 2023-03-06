import { useState, useEffect } from "react"
import { useAddNewTaskMutation, useGetTasksQuery, selectTaskById, selectAllTasks } from "./tasksApiSlice"
import { useAddNewSubtaskMutation } from "../subtasks/subtasksApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { selectAllColumns } from "../columns/columnsApiSlice"
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconcross from "../assets/icon-cross.svg";
import ColumnList2 from "../columns/ColumnList2"


const NewTask = () => {
  const { backgroundColor1, textColor, backgroundColor2 } = useOutletContext(); 
  const { id, taskid } = useParams()
  const navigate = useNavigate()
  const board = useSelector(state => selectBoardById(state, id))
  const columns = useSelector(selectAllColumns)

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
  const columnsForMenu = fullColumnInBoard.map(column => {
    return (
      <option
        key={column.id}
        value={column.id}
      >{column.name}</option>
    )
  })

  const goToBoard = () => navigate(`/board/${id}`)


  const {
    data: tasks,
    // isLoading,
    // isSuccess,
    // isError,
    // error
  } = useGetTasksQuery()

 
  const [addNewTask, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewTaskMutation()


  const [addNewSubtask, {
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    isError: isError2,
    error: error2
  }] = useAddNewSubtaskMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [columnId, setColumnId] = useState(fullColumnInBoard[0].id)
  // const [column, setColumn] = useState('')
  const [subtaskTitles, setSubtaskTitles] = useState([{ title: '' }])
  const [isHover, setIsHover] = useState({})

 const CounterComponent = () => {
   const task = useSelector(selectAllTasks)
         const taskId = task[id.length - 1]
        // console.log(subtaskTitle.title);

//       subtaskTitles.map(async(subtaskTitle) => {
//         await addNewSubtask({ title: subtaskTitle.title, taskId })
//         // console.log(subtaskTitle.title);
// })
}

  useEffect(() => {

    if (isSuccess ) {
      // setSubtaskTitles([])
      setTitle('')
      setDescription('')
      setColumnId('')

      setSubtaskTitles('')

    }
  }, [isSuccess, navigate, id, addNewSubtask, subtaskTitles, tasks])

  const onTitleCreated = e => setTitle(e.target.value)
  const onDescriptionCreated = e => setDescription(e.target.value)
  const onColumnChosen = e => setColumnId(e.target.value)
  // const onColumnChosen = (message) => {
  //   setColumn(message);
  // };
  const onSubtaskTitlesCreated = (index, event) => {
    let data = [...subtaskTitles];
    data[index][event.target.name] = event.target.value;
    setSubtaskTitles(data);
  }


  const addSubtitles = (e) => {
    e.preventDefault()
    let newSubtitle = { title: '' }
    setSubtaskTitles([...subtaskTitles, newSubtitle])

  }

  const removeSubtitles = (index) => {
    let data = [...subtaskTitles];
    data.splice(index, 1)
    setSubtaskTitles(data)

  }
    const specialStyle = "none"
    const specialStyle2 = "inline"
      const specialStyle3 = " rgb(234, 85, 85)"
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
  const canSaveTask = [title, columnId].every(Boolean) && !isLoading

  const canSaveSubtask = !isLoading2


  let disabled

  if (subtaskTitles.find(o => o.title === '')) {
    disabled = true
  } else {
    disabled = false

  }
  const onformSubmited = async (e) => {
    e.preventDefault()

    if (canSaveTask
      // & canSaveSubtask
    ) {
      await addNewTask({ title, description, columnId })

//       const { ids } = tasks
//       const taskId = ids[ids.length - 1]

//       subtaskTitles.map(async(subtaskTitle) => {
//         await addNewSubtask({ title: subtaskTitle.title, taskId })
//         // console.log(subtaskTitle.title);
// })
      
    }

navigate(`/board/${id}`)
  }

  const errClass = isError || isError2 ? "errmsg" : "offscreen"

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <p className={errClass}>{error2?.data?.message}</p>
      <div className="overlay" onClick={goToBoard}></div>
      <form className="newBoardForm" onSubmit={onformSubmited} style={{ backgroundColor: backgroundColor1 }}>
        <h3 style={{ color: textColor }}>Add New Task</h3>
        <label htmlFor="title" style={{ color: textColor }}>Title</label>
        <div className="inputClass"
          style={title === '' ? { borderColor: specialStyle3 } : null}>
        <input
          id="title"
          name="title"
          type="text"
          autoComplete="off"
                    className="inputName"
            style={{ backgroundColor: backgroundColor1, color: textColor }}
          value={title}
          onChange={onTitleCreated}
          placeholder="e.g. Take coffee break"
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
          style={{ backgroundColor: backgroundColor1, color: textColor }}
          placeholder="e.g. It’s always good to take a break. 
          This 15 minute break will 
recharge the batteries a little."
        />
        <label htmlFor="subtask" style={{ color: textColor }}>Subtasks</label>
        {subtaskTitles.map((input, index) => {
          return (
            <div className="newBoardForm2"
              key={index}>
              <div className="inputClass" style={input.title === '' ? { borderColor: specialStyle3 } : null}>
              <input
                id="subtask"
                name="title"
                type="text"
                autoComplete="off"
                  value={input.title}
                  style={{ backgroundColor: backgroundColor1, color: textColor }}
                  onChange={event => onSubtaskTitlesCreated(index, event)}
                placeholder='e.g. Make coffee'
              />
                        <span
            style={input.title === '' ? { display: specialStyle2 } : { display: specialStyle }}
                >Can’t be empty</span>
                        </div>

              <button
                onClick={() => removeSubtitles(index)}
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
        })}
        <button className="lightButton" onClick={addSubtitles}>+ Add New Subtitle</button>
        <label htmlFor="columns" className='labelcolumns' style={{ color: textColor }}>Status</label>
        <select id='columns' className='selectcolumns' onChange={onColumnChosen}
          value={columnId}
          style={{ backgroundColor: backgroundColor1, color: textColor }}
        >
          {/* <ColumnList2 /> */}
          {columnsForMenu}
        </select>
        <button type="submit" className="darkButton" disabled={!canSaveTask  || disabled
          // || !canSaveSubtask
        }>Create Task</button>
      </form>
    </>
  )

  return content

}

export default NewTask
