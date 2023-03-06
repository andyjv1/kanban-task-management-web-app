import { useState, useEffect } from "react"
import { useAddNewBoardMutation, useGetBoardsQuery } from "./boardsApiSlice"
import { useAddNewColumnMutation } from "../columns/columnsApiSlice"
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from "./boardsApiSlice"
import iconcross from "../assets/icon-cross.svg";


const NewBoard = () => {
        const { backgroundColor1, textColor, backgroundColor2 } = useOutletContext(); 
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
    const [columnNames, setColumnNames] = useState([{ name: '' }])
    const [isHover, setIsHover] = useState({})



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
    const canSaveBoard = [name].every(Boolean) && !isLoading

    const canSaveColumn = !isLoading2

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

        let disabled

    if (columnNames.find(o => o.name === '')) {
        disabled = true
    } else {
        disabled = false

    }
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
            <form className="newBoardForm" onSubmit={onSaveBoardColumnClicked}
            style={{ backgroundColor: backgroundColor1 }}>
                <h3 style={{ color: textColor }}>Add New Board</h3>
                <label htmlFor="name" style={{ color: textColor }}>Name</label>
                <div className="inputClass"
                    style={name === '' ? { borderColor: specialStyle3 } : null}>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        value={name}
                        onChange={onnameChanged}
                        placeholder="e.g. Web Design"
                        style={{ backgroundColor: backgroundColor1 }}
                    />
                    <span
                        style={name === '' ? { display: specialStyle2 } : { display: specialStyle }}
                    >Can’t be empty</span>
                </div>
                <label htmlFor="column" style={{ color: textColor }}>Columns</label>
                {columnNames.map((input, index) => {
                    return (
                        <div className="newBoardForm2" key={index}>
                            <div className="inputClass"
                                style={input.name === '' ? { borderColor: specialStyle3 } : null}>
                                <input
                                    id="column"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={input.name}
                                    onChange={event => onColumnNameChanged(index, event)}
                                    placeholder='Todo'
                                    style={{ backgroundColor: backgroundColor1 }}
                                />
                                <span
                                    style={input.name === '' ? { display: specialStyle2 } : { display: specialStyle }}
                                >Can’t be empty</span>
                            </div>
                            <button
                                onClick={() => removeColumns(index)}
                                onMouseEnter={(e) => {
                                    mouseOver(e, index);
                                }}
                                onMouseLeave={(e) => {
                                    mouseOut(e, index);
                                }}>
                                <img src={iconcross} alt=""
                                    style={isHover[index] & input.name === '' ? { filter: specialStyle4 } : null}

                                />
                            </button>
                        </div>
                    )
                })}
                <button className="lightButton" onClick={addColumns}>+ Add New Column</button>
                <button className="darkButton" disabled={!canSaveBoard || !canSaveColumn                 || disabled
}>Create New Board</button>
            </form>
        </>
    )

    return content

}

export default NewBoard

