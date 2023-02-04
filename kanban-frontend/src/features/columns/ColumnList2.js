import { useGetColumnsQuery } from './columnsApiSlice';
import Column2 from './Column2'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from '../boards/boardsApiSlice';


const ColumnList2 = () => {

    const { id } = useParams()

    const board = useSelector(state => selectBoardById(state, id))

    const {
        data: columns,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetColumnsQuery()

    let content

    if (isLoading) content = <p>Loading Columns...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = columns


        const columnInBoard = board.columns.filter(i => ids.includes(i))

        
        const columnsNewContent = columnInBoard?.length
            ? columnInBoard.map(columnid => <Column2 key={columnid} columnid={columnid} boardId={id} />)
            : null

        content = (
            <> {columnsNewContent} </>
        )
    }

    return content


}

export default ColumnList2