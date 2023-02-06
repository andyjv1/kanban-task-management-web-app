import { useSelector } from 'react-redux'
import { selectColumnById } from '../columns/columnsApiSlice'
import { useDeleteColumnMutation } from "../columns/columnsApiSlice"
import { useEffect } from "react"
import iconcross from "../assets/icon-cross.svg";

const USER_REGEX = /^[A-z]{3,20}$/

const EditBoardColumns = ({ columnid, boardId, columnNames,
    setColumnNames, validColumnNames,
    setValidColumnNames, isDelSuccess, isDelError, delerror, onColumnNameChanged, onSaveBoardColumn, updateColumn, deleteColumn }) => {
    const column = useSelector(state => selectColumnById(state, columnid))



    useEffect(() => {
        setValidColumnNames(USER_REGEX.test(columnNames))
    }, [columnNames])

    if (onSaveBoardColumn == true) {
        updateColumn({ id: column.id, name: column.name, boardId })

    }

    const onDeleteColumnClicked = async () => {
        await deleteColumn({ boardId: boardId, id: column.id })
    }
    return (
        <div>
            <input
                id="column"
                name="column"
                type="text"
                autoComplete="off"
                value={column.name}
                onChange={onColumnNameChanged}
                placeholder="Todo"
            />

            <button onClick={onDeleteColumnClicked}><img src={iconcross} alt="" /></button>
        </div>
    )
}

export default EditBoardColumns