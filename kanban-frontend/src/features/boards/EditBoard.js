import BoardLayout from "../../components/BoardLayout"
import EditBoardColumns from "./EditBoardColumns"
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from "react"
import { useUpdateBoardMutation, useDeleteBoardMutation, selectBoardById } from "./boardsApiSlice"
import {
    useUpdateColumnMutation, useDeleteColumnMutation,
    useGetColumnsQuery, selectColumnById
} from "../columns/columnsApiSlice"
import iconcross from "../assets/icon-cross.svg";

const USER_REGEX = /^[A-z]{3,20}$/

const EditBoard = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const board = useSelector(state => selectBoardById(state, id))

    const goToBoard = () => board
        ? navigate(`/board/${id}`)
        : navigate(`/board`)

    const [updateBoard, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateBoardMutation()

    const [updateColumn,
        {
            isLoading: isLoading2,
            isSuccess: isSuccess2,
            isError: isError2,
            error: error2
        }] = useUpdateColumnMutation()

    const {
        data: columns,
        isLoading: isLoading3,
        isSuccess: isSuccess3,
        isError: isError3,
        error: error3
    } = useGetColumnsQuery()

    const [deleteColumn, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteColumnMutation()

     const [name, setName] = useState(board.name)
    const [validName, setValidName] = useState(false)
    const [columnNames, setColumnNames] = useState('')
    const [validColumnNames, setValidColumnNames] = useState(false)
    const [onSaveBoardColumn, setOnSaveBoardColumn] = useState(false)

    let columnInBoard
    if (columns) {
            const { ids } = columns

     columnInBoard = board.columns.filter(i => ids.includes(i))
    }


   


    useEffect(() => {
        setValidName(USER_REGEX.test(name))
    }, [name])

    // useEffect(() => {
    //     setValidColumnNames(USER_REGEX.test(columnNames))
    // }, [columnNames])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess
            // || isSuccess2 || isDelSuccess
        ) {
            setName('')
            setColumnNames('')
            board ? navigate(`/board/${id}`) : navigate(`/board`)
        }

    }, [isSuccess, navigate,
        // isSuccess2, isDelSuccess,
        board, id])

    const onnameChanged = e => setName(e.target.value)

    const onColumnNameChanged = e => setName(e.target.value)

    const columnsNewContent = columnInBoard?.length
        ? columnInBoard.map(columnid => <EditBoardColumns key={columnid} validColumnNames={validColumnNames}
            setValidColumnNames={setValidColumnNames} columnid={columnid} boardId={id} columnNames={columnNames}
            isDelSuccess={isDelSuccess} isDelError={isDelError} delerror={delerror} setColumnNames={setColumnNames}
            onColumnNameChanged={onColumnNameChanged} onSaveBoardColumn={onSaveBoardColumn} updateColumn={updateColumn}
            deleteColumn={deleteColumn}
        />) : null

    const onSaveBoardColumnClicked = async (e) => {
        e.preventDefault()
        await updateBoard({ id: board.id, name })
        setOnSaveBoardColumn(true)
        navigate(`/board/${id}`) 
    }

    const addColumns = (e) => {
        e.preventDefault()
        let newColumn = { name: '' }
        setColumnNames([...columnNames, newColumn])
    }

    const removeColumns = (index) => {
        let data = [...columnNames];
        data.splice(index, 1)
        setColumnNames(data)
    }

    const canSaveBoard = [validName].every(Boolean) && !isLoading

    const canSaveColumn = [columnNames.length, validColumnNames].every(Boolean) && !isLoading2

    const content = (<>
        <div className="overlay" onClick={goToBoard}></div>
        <form className="newBoardForm"
        onSubmit={onSaveBoardColumnClicked}
        >
            <h3>Edit Board</h3>
            <label htmlFor="name">Board Name</label>
            <input
                id="name"
                name="name"
                type="text"
                autoComplete="off"
                value={name}
                onChange={onnameChanged}
            />
            <label htmlFor="column">Board Columns</label>
            {columnNames.map((input, index) => {
                return (
                    <div className="newBoardForm2" key={index}>
                        <input
                            id="column"
                            name="name"
                            type="text"
                            autoComplete="off"
                            value={input.name}
                            onChange={event => onColumnNameChanged(index, event)}
                            placeholder='Todo'
                        />
                        <button onClick={() => removeColumns(index)}><img src={iconcross} alt="" /></button>
                    </div>
                )
            })}
            {/* <div className="newBoardForm2"
            // key={index}
            >
                <input
                    id="column"
                    name="name"
                    type="text"
                    autoComplete="off"
                    // value={input.name}
                    // onChange={event => onColumnNameChanged(index, event)}
                    placeholder='Todo'
                />
                <button
                // onClick={() => removeColumns(index)}
                ><img src={iconcross} alt="" /></button>
            </div> */}
            <button className="lightButton"
                onClick={addColumns}
            >+ Add New Column</button>
            <button className="darkButton" disabled={!canSaveBoard
                || !canSaveColumn
            }
            >Save Changes</button>
        </form>
    </>)

    return content
}


export default EditBoard