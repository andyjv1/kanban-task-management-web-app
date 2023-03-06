import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from "react"
import { useUpdateBoardMutation, useDeleteBoardMutation, selectBoardById } from "./boardsApiSlice"
import {
    useUpdateColumnMutation, useDeleteColumnMutation,
    useGetColumnsQuery, selectColumnById, useAddNewColumnMutation
} from "../columns/columnsApiSlice"
import iconcross from "../assets/icon-cross.svg";

const USER_REGEX = /^[A-z]{3,20}$/

const EditBoard = () => {
    const { backgroundColor1, textColor, backgroundColor2 } = useOutletContext(); 
    const { id } = useParams()
    const navigate = useNavigate()
    const goToBoard = () => board
        ? navigate(`/board/${id}`)
        : navigate(`/board`)

    //BOARD

    const board = useSelector(state => selectBoardById(state, id))

    const [updateBoard, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateBoardMutation()

    const [name, setName] = useState(board.name)

    const onnameChanged = e => setName(e.target.value)
    // const [validName, setValidName] = useState(false)
    // const [onSaveBoardColumn, setOnSaveBoardColumn] = useState(false)

    //COLUMN

    const {
        data: columns,
        isLoading: isLoading3,
        isSuccess: isSuccess3,
        isError: isError3,
        error: error3
    } = useGetColumnsQuery()

    const [addNewColumn, {
        // isLoading,
        // isSuccess,
        // isError,
        // error
    }] = useAddNewColumnMutation()



    const [updateColumn,
        {
            // isLoading: isLoading2,
            // isSuccess: isSuccess2,
            // isError: isError2,
            // error: error2
        }] = useUpdateColumnMutation()



    const [deleteColumn, {
        // isSuccess: isDelSuccess,
        // isError: isDelError,
        // error: delerror
    }] = useDeleteColumnMutation()

    let fullColumnInBoard = []

    const { entities } = columns
    const columnsIds = Object.keys(entities).map((item => item))
    const columnInBoard = board.columns.filter(i => columnsIds.includes(i))

    columnInBoard.map(sub => {
        if (Object.values(entities).find(obj => obj.id === sub)) {
            fullColumnInBoard.push(Object.values(entities).find(obj => obj.id === sub))

        }
    })

    const [column, setColumn] = useState([...fullColumnInBoard])
    const [isHover, setIsHover] = useState({})

    // const [validColumnNames, setValidColumnNames] = useState(false)


    const onColumnNameChanged = (index, event) => {
        let data = []
        column.forEach((col, i) => {
            data[i] = { ...col }
        })
        data[index][event.target.name] = event.target.value
        setColumn(data)
    }

    const onDeleteColumnClicked = async (index, event) => {
        event.preventDefault()
        if (column[index].id) {
            await deleteColumn({ boardId: board.id, id: column[index].id })
            let data = []
            column.forEach((col, i) => {
                data[i] = { ...col }
            })
            data.splice(index, 1)
            setColumn(data)
        } else {
            let data = []
            column.forEach((col, i) => {
                data[i] = { ...col }
            })
            data.splice(index, 1)
            setColumn(data)
        }
    }
    const addColumns = (e) => {
        e.preventDefault()
        let newColumn = { name: '' }
        setColumn([...column, newColumn])
    }
    const specialStyle = "none"
        const specialStyle2 = "inline"
        const specialStyle3 = " rgb(234, 85, 85)"
    const columnComponent = column.map((input, index) => {

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
            <div className="newBoardForm2"
                key={index}
            >
                <div className="inputClass" 
                style={input.name === '' ? { borderColor: specialStyle3 } : null}>
                    <input
                        id="column"
                        name="name"
                        type="text"
                        autoComplete="off"
                        value={input.name}
                        onChange={event => onColumnNameChanged(index, event)}
                        style={{ backgroundColor: backgroundColor1, color: textColor }}
                    />
                    <span
                        style={input.name === '' ? { display: specialStyle2 } : { display: specialStyle }}
                    >Can’t be empty</span>
                </div>

                <button
                    onClick={event => onDeleteColumnClicked(index, event)}
                    onMouseEnter={(e) => {
                        mouseOver(e, index);
                    }}
                    onMouseLeave={(e) => {
                        mouseOut(e, index);
                    }}
                ><img src={iconcross} alt=""
                    style={isHover[index] & input.name === '' ? { filter: specialStyle4 } : null}

                    /></button>
            </div>
        )
    })

    // useEffect(() => {
    //     setValidName(USER_REGEX.test(name))
    // }, [name])

    // useEffect(() => {
    //     setValidColumnNames(USER_REGEX.test(columnNames))
    // }, [columnNames])

    // useEffect(() => {
    //     console.log(isSuccess)
    //     if (isSuccess
    //         // || isSuccess2 || isDelSuccess
    //     ) {
    //         setName('')
    //         setColumnNames('')
    //         board ? navigate(`/board/${id}`) : navigate(`/board`)
    //     }

    // }, [isSuccess, navigate,
    //     // isSuccess2, isDelSuccess,
    //     board, id])
    let disabled

    if (column.find(o => o.name === '')) {
        disabled = true
    } else {
        disabled = false

    }
    const onSaveBoardColumnClicked = async (e) => {
        e.preventDefault()

        await updateBoard({ id: board.id, name })
        // setOnSaveBoardColumn(true)
        await column.map(col => {
            if (col.id) {
                updateColumn({ boardId: board.id, id: col.id, name: col.name })
                console.log(col.name);
            } else {
                addNewColumn({ boardId: board.id, name: col.name })
                console.log(col.name);

            }
        })
        navigate(`/board/${id}`)
    }

    const canSaveBoard = [name].every(Boolean) && !isLoading

    // const canSaveColumn = [columnNames.length, validColumnNames].every(Boolean) && !isLoading2

    const content = (<>
        <div className="overlay" onClick={goToBoard}></div>
        <form className="newBoardForm"
            onSubmit={onSaveBoardColumnClicked}
            style={{ backgroundColor: backgroundColor1 }}
        >
            <h3 style={{ color: textColor }}>Edit Board</h3>
            <label htmlFor="name" style={{ color: textColor }}>Board Name</label>
                    <div className="inputClass"
          style={name === '' ? { borderColor: specialStyle3 } : null}>

            <input
                id="name"
                name="name"
                type="text"
                autoComplete="off"
                value={name}
                    onChange={onnameChanged}
                    style={{ backgroundColor: backgroundColor1, color: textColor }}
                />
                          <span
            style={name === '' ? { display: specialStyle2 } : { display: specialStyle }}
          >Can’t be empty</span>
        </div>
            <label htmlFor="column" style={{ color: textColor }}>Board Columns</label>
            {columnComponent}
            <button className="lightButton"
                onClick={addColumns}
            >+ Add New Column</button>
            <button className="darkButton"
                disabled={!canSaveBoard
                || disabled
            //     || !canSaveColumn
            }
            >Save Changes</button>
        </form>
    </>)

    return content
}


export default EditBoard