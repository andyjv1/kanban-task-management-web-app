import { useState, useEffect } from "react"
import { useAddNewTaskMutation, useGetTasksQuery, selectTaskById } from "./tasksApiSlice"
import { useAddNewSubtaskMutation } from "../subtasks/subtasksApiSlice"
import { selectBoardById } from "../boards/boardsApiSlice"
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconcross from "../assets/icon-cross.svg";
import ColumnList2 from "../columns/ColumnList2"


const NewTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const board = useSelector(state => selectBoardById(state, id))

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
  const [subtaskTitles, setSubtaskTitles] = useState([{ title: '' }])



  useEffect(() => {
    if (isSuccess & isSuccess2) {
      setSubtaskTitles([])
      setTitle('')
      setDescription('')

      navigate(`/board/${id}`)
    }
  }, [isSuccess, isSuccess2, navigate, subtaskTitles, title, id])

  const onTitleCreated = e => setTitle(e.target.value)
  const onDescriptionCreated = e => setDescription(e.target.value)

  const onSubtaskTitlesCreated = (index, event) => {
    let data = [...subtaskTitles];
    data[index][event.target.name] = event.target.value;
    setSubtaskTitles(data);
    console.log(data);
    console.log(data[index]);
    console.log(event.target.name);
    console.log(event.target.value);

  }


  const addSubtitles = (e) => {
    e.preventDefault()
    let newSubtitle = { title: '' }
    setSubtaskTitles([...subtaskTitles, newSubtitle])
    console.log('clicked');
  }

  const removeSubtitles = (index) => {
    let data = [...subtaskTitles];
    data.splice(index, 1)
    setSubtaskTitles(data)
        console.log('clicked');

  }
  const canSaveTask = !isLoading

  const canSaveSubtask = !isLoading2

  const onformSubmited = async (e) => {
      e.preventDefault()

      if (canSaveTask & canSaveSubtask) {
          await addNewTask({ title, description })

          // const { ids } = boards
          // const boardId = ids[ids.length - 1]

          // await addNewSubtitle({ name: subtaskTitles, boardId })
      }
      navigate(`/board/${id}`) 
  }

  const errClass = isError || isError2 ? "errmsg" : "offscreen"


  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <p className={errClass}>{error2?.data?.message}</p>
      <div className="overlay" onClick={navigate(`/board/${id}`)}></div>
      <form className="newBoardForm" onSubmit={onformSubmited}>
        <h3>Add New Task</h3>
        <label htmlFor="title">title</label>
        <input
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleCreated}
          placeholder="e.g. Take coffee break"
        />
        <label htmlFor="description">Description</label>
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
        />
        <label htmlFor="subtitle">Subtitles</label>
        {subtaskTitles.map((input, index) => {
          return (
            <div className="newBoardForm2" key={index}>
              <input
                id="subtitle"
                name="title"
                type="text"
                autoComplete="off"
                value={input.title}
                onChange={event => onSubtaskTitlesCreated(index, event)}
                placeholder='e.g. Make coffee'
              />
              <button
                onClick={() => removeSubtitles(index)}
              ><img src={iconcross} alt="" /></button>
            </div>
          )
        })}
        <button className="lightButton" onClick={addSubtitles}>+ Add New Subtitle</button>
        <label htmlFor="columns" className='labelcolumns'>Status</label>
        <select id='columns' className='selectcolumns'>
          <ColumnList2 />
        </select>
        <button className="darkButton" disabled={!canSaveTask || !canSaveSubtask}>Create New Board</button>
      </form>
    </>
  )

  return content

}

export default NewTask
