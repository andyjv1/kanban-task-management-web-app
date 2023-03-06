import { useGetBoardsQuery, selectBoardById } from './boardsApiSlice';
import Board from './Board'
import iconBoard from "../assets/icon-board.svg";
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BoardsList = ({ setSidebarOpen, wide, chevronClicked, setChevronClicked }) => {

    const {
        data: boards,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBoardsQuery()
    let content

    const navigate = useNavigate()

    const { id } = useParams()

    const board = useSelector(state => selectBoardById(state, id))

    const goToCreateBoard = () => {
        if (board) {
            if (wide <= 470) {
                setChevronClicked(!chevronClicked)
                navigate(`/board/${id}/createboard`)
            } else {
                navigate(`/board/${id}/createboard`)

            }
        } else {
            if (wide <= 470) {
                setChevronClicked(!chevronClicked)
                navigate(`/board/createboard`)
            } else {
                navigate(`/board/createboard`)

            }
        }
    }

    if (isLoading) content = <p>Loading Boards...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = boards

        const boardContent = ids?.length
            ? ids.map(boardId => <Board key={boardId} boardId={boardId} setSidebarOpen={setSidebarOpen} wide={wide}
                chevronClicked={chevronClicked} setChevronClicked={ setChevronClicked} />)
            : null

        const numberOfBoards = ids.length

        content = (
            <div className='nameBoardSideBar'>
                <div className='sidebarBoardName'>
                    <p>ALL BOARDS ({numberOfBoards})</p>
                </div>
                <div className='boards'>
                    {boardContent}
                    <div className='createdBoard'>
                        <img src={iconBoard} alt="" />
                        <p onClick={goToCreateBoard}>+ Create New Board</p>
                    </div>
                </div>
            </div>
        )
    }

    return content
}

export default BoardsList