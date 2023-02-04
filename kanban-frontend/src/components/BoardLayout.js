import { Outlet, useLocation } from "react-router-dom"
import React, { useState, useEffect, useRef } from 'react'
import logodark from "../features/assets/logo-dark.svg";
import iconVerticalEllipsis from "../features/assets/icon-vertical-ellipsis.svg";
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoardById } from '../features/boards/boardsApiSlice';
import ColumnsList from '../features/columns/ColumnsList';
import iconShowSidebar from "../features/assets/icon-show-sidebar.svg";
import iconLightTheme from "../features/assets/icon-light-theme.svg";
import iconDarkTheme from "../features/assets/icon-dark-theme.svg";
import iconHideSidebar from "../features/assets/icon-hide-sidebar.svg";
import BoardsList from '../features/boards/BoardsList';
import { useNavigate } from 'react-router-dom'

const BoardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState('')     // when purple clicked, flex else none
    const [boardLogoNavDiv1, setBoardLogoNavDiv1] = useState('')
    const [boardLogoNavDiv2, setBoardLogoNavDiv2] = useState('')
    const [bigNavDiv, setBigNavDiv] = useState('')
    const [sidebarClosedButton, setSidebarClosedButton] = useState('')     // when purple clicked, none else flex
    const [editBoardBox, setEditBoardBox] = useState(true)


    const onSidebarButtonClicked = () => {
        setSidebarOpen('flex')
        setSidebarClosedButton('none')
        setBoardLogoNavDiv1('none')
        setBoardLogoNavDiv2('320px')
        setBigNavDiv('1040px')
    }

    const onSidebarButtonClickedClosed = () => {
        setSidebarOpen('none')
        setSidebarClosedButton('flex') ///////
        setBoardLogoNavDiv1('solid 1px rgb(228, 235, 250)') ///////
        setBoardLogoNavDiv2('') ///////
        setBigNavDiv('100%')
    }


    const ref = useRef()

    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        setEditBoardBox(true)
    }, [location, sidebarOpen])
    const { id } = useParams()

    const board = useSelector(state => selectBoardById(state, id))

    let content

    let mainColumnsContainerValue

    let classValue

    let onVerticalIconClicked

    let disabled

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (!editBoardBox && ref.current && !ref.current.contains(e.target)) {
                setEditBoardBox(true)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [editBoardBox])

    if (board) {

        onVerticalIconClicked = () => { setEditBoardBox(!editBoardBox) }
        disabled = true

        if (board.columns.length) {
            mainColumnsContainerValue = (
                <>
                    <ColumnsList />
                    <div className="columnsContainerPlus">
                        <div className="columnNamePlus">
                            <span></span>
                            <p>DONE (6)</p>
                        </div>
                        <div className='taskBoxPlus' onClick={() => { navigate(`/board/${id}/editboard`) }}>
                            <h4>+ New Column</h4>
                        </div>
                    </div>
                </>
            )
            classValue = "mainColumnsContainer";
        } else {
            mainColumnsContainerValue = (
                <>
                    <p>This board is empty. Create a new column to get started.</p>
                    <button onClick={() => { navigate(`/board/${id}/editboard`) }}>+ Add New Column</button>
                </>
            );
            classValue = "mainColumnsContainer2";
        }

        content = (<div className={classValue} >
            {mainColumnsContainerValue}
            <div className='sidebarClosedButton'
                style={{ display: sidebarClosedButton }}
                onClick={onSidebarButtonClicked}>
                <img src={iconShowSidebar} alt="" />
            </div>
        </div>)
    } else {
        content = (<div className="mainColumnsContainer" style={{ justifyContent: "center", alignItems: "center" }}>
            <h1>Choose a Board</h1>
            <div className='sidebarClosedButton'
                style={{ display: sidebarClosedButton }}
                onClick={onSidebarButtonClicked}>
                <img src={iconShowSidebar} alt="" />
            </div>
        </div>)
        onVerticalIconClicked = null

        disabled=false
    }



    return (

        <>
            <header>
                <div className='boardLogoNavDiv' style={{ borderBottom: boardLogoNavDiv1, width: boardLogoNavDiv2 }}><img src={logodark} alt="" /></div> {/*make a bit bigger when the sidebar is shown*/}
                <div className='bigNavDiv' style={{ width: bigNavDiv }}>
                    <h1>Platform Launch</h1>
                    <div className='buttonNavDiv'>
                        <button disabled={!disabled} onClick={() => { navigate(`/board/${id}/createtask`) }}>+ Add New Task</button>
                        <img src={iconVerticalEllipsis} alt="" onClick={onVerticalIconClicked} />
                    </div>
                </div>
                <div className='editBoardBox' ref={ref} style={{ display: editBoardBox ? "none" : "flex" }}>
                    <p className='greyP' onClick={() => { navigate(`/board/${id}/editboard`) }}>Edit Board</p>
                    <p className='redP' onClick={() => { navigate(`/board/${id}/deleteboard`) }}>Delete Board</p>
                </div>
            </header>



            <div className="mainContainer">
                <Outlet />
                <div className='sidebarOpen' style={{ display: sidebarOpen }}>
                    <BoardsList />
                    <div className='toggleMainDiv'>
                        <div className='toggleDiv'>
                            <img src={iconLightTheme} alt="" />
                            <input className='toggleCheckbox' type="checkbox" id="switch" /><label id="switch" htmlFor="switch">Toggle</label>
                            <img src={iconDarkTheme} alt="" />

                        </div>
                        <div className='clickSidebarOffDiv' onClick={onSidebarButtonClickedClosed}>
                            <img src={iconHideSidebar} alt="" />
                            <p>Hide SideBar</p>
                        </div>
                    </div>
                </div>
                {content}

            </div>
        </>
    )
}

export default BoardLayout