import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from './boardsApiSlice'
import iconBoard from "../assets/icon-board.svg";
import { useParams } from 'react-router-dom'

const Board = ({ boardId, setSidebarOpen, wide, setChevronClicked, chevronClicked }) => {
    const board = useSelector(state => selectBoardById(state, boardId))
    const navigate = useNavigate()

    const { id } = useParams()
    let boardClass
    if (id === boardId) {
        boardClass = "clickedBoardHighlighted"
    } else {
        boardClass = "clickedBoard"
    }
    if (board) {
        const pickBoard = () => {
            if (wide <= 470) {
                setChevronClicked(!chevronClicked)
                navigate(`/board/${boardId}`)
            } else {
                navigate(`/board/${boardId}`)

            }

        }
        return (
            <div className={boardClass}
                onClick={pickBoard}>
                <img src={iconBoard} alt="" />
                <p>{board.name}</p>
            </div>
        )

    } else return null
}

export default Board