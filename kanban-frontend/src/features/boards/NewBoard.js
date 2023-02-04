import { useState, useEffect } from "react"
import { useAddNewBoardMutation, useGetBoardsQuery } from "./boardsApiSlice"
import { useAddNewColumnMutation } from "../columns/columnsApiSlice"
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from "./boardsApiSlice"
import iconcross from "../assets/icon-cross.svg";


const NewBoard = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const board = useSelector(state => selectBoardById(state, id))

    const goToBoard = () => board
        ? navigate(`/board/${id}`)
        : navigate(`/board`)


    const {
        data: boards,
        // isLoading,
        // isSuccess,
        // isError,
        // error
    } = useGetBoardsQuery()

    const [addNewBoard, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewBoardMutation()


    const [addNewColumn, {
        isLoading: isLoading2,
        isSuccess: isSuccess2,
        isError: isError2,
        error: error2
    }] = useAddNewColumnMutation()

    const [name, setName] = useState('')
    const [columnNames, setColumnNames] = useState([{name: ''}])



    useEffect(() => {
        if (isSuccess & isSuccess2) {
            setColumnNames([])
            setName('')

            board ? navigate(`/board/${id}`) : navigate(`/board`)
        }
    }, [isSuccess, isSuccess2, navigate, board, id])

    const onnameChanged = e => setName(e.target.value)

    const onColumnNameChanged = (index, event) => {
        let data = [...columnNames];
        data[index][event.target.name] = event.target.value;
        setColumnNames(data);
        console.log(data);
        console.log(data[index]);
        console.log(event.target.name);
        console.log(event.target.value);

    }


    const addColumns = (e) => {
        e.preventDefault()
        let newColumn = { name: ''}
        setColumnNames([...columnNames, newColumn])
    }

    const removeColumns = (index) => {
        let data = [...columnNames];
        data.splice(index, 1)
        setColumnNames(data)
    }
    const canSaveBoard = !isLoading

    const canSaveColumn = !isLoading2

    const onSaveBoardColumnClicked = async (e) => {
        e.preventDefault()

        if (canSaveBoard & canSaveColumn) {
            await addNewBoard({ name })

            const { ids } = boards
            const boardId = ids[ids.length - 1]

            await addNewColumn({ name: columnNames, boardId })
        }
        board ? navigate(`/board/${id}`) : navigate(`/board`)
    }

    const errClass = isError || isError2 ? "errmsg" : "offscreen"


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <p className={errClass}>{error2?.data?.message}</p>
            <div className="overlay" onClick={goToBoard}></div>
            <form className="newBoardForm" onSubmit={onSaveBoardColumnClicked}>
                <h3>Add New Board</h3>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={onnameChanged}
                    placeholder="e.g. Web Design"
                />
                <label htmlFor="column">Columns</label>
                {columnNames.map((input, index) => {
                    return (
                        <div className="newBoardForm2"  key={index}>
                            <input
                                id="column"
                                name="name"
                                type="text"
                                autoComplete="off"
                                value={input.name}
                                onChange={event => onColumnNameChanged(index, event) }
                                placeholder='Todo'
                            />
                            <button onClick={() => removeColumns(index)}><img src={iconcross} alt="" /></button>
                        </div>
                    )
                })}
                <button className="lightButton" onClick={addColumns}>+ Add New Column</button>
                <button className="darkButton" disabled={!canSaveBoard || !canSaveColumn}>Create New Board</button>
            </form>
        </>
    )

    return content

}

export default NewBoard

