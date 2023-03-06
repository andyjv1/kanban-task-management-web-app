import {
    Outlet,
    // useLocation
} from "react-router-dom"
import React, { useState, useEffect, useRef } from 'react'
import logodark from "../features/assets/logo-dark.svg";
import logolight from "../features/assets/logo-light.svg"
import logoMobile from "../features/assets/logo-mobile.svg"
import addMobile from "../features/assets/icon-add-task-mobile.svg"
import chevronDown from "../features/assets/icon-chevron-down.svg"
import chevronUp from "../features/assets/icon-chevron-up.svg"
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
    const [sidebarOpen, setSidebarOpen] = useState('flex')
    const [boardLogoNavDiv1, setBoardLogoNavDiv1] = useState('')
    const [boardLogoNavDiv2, setBoardLogoNavDiv2] = useState('')
    const [bigNavDiv, setBigNavDiv] = useState('')
    const [sidebarClosed, setSidebarClosed] = useState('none')
    // const [editBoardBox, setEditBoardBox] = useState(true)
    const [pageWhite, setPageWhite] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isActive, setIsActive] = useState("active")
    const [chevronClicked, setChevronClicked] = useState(true)
    // const [isActive2, setIsActive2] = useState("active")
      const [width, setWidth] = useState("100%")

    // toggle ? setSidebarOpen('flex'):setSidebarOpen('none')

    let backgroundColor1
    let backgroundColor2
    let textColor
    let logodisplay

    if (pageWhite) {
        backgroundColor1 = ""
        backgroundColor2 = ""
        textColor = ""
        logodisplay = "none"
    } else {
        backgroundColor1 = "rgb(62,63,78)"
        backgroundColor2 = "rgb(43,44,55)"
        textColor = "white"
        logodisplay = "inline"
    }

    const useWindowWide = (size) => {
        const [width, setWidth] = useState(0)

        useEffect(() => {
            function handleResize() {
                setWidth(window.innerWidth)
            }

            window.addEventListener("resize", handleResize)

            handleResize()

            return () => {
                window.removeEventListener("resize", handleResize)
            }
        }, [setWidth])

        return width
    }
    const wide = useWindowWide(375)

    const onSidebarButtonClicked = () => {
        //   setWidth("100%")
        setIsActive('active')
        // setIsActive2('active')
        setTimeout(() => {
          setWidth("100%")
        }, 1000)
        // setTimeout(() => {
        //     setIsActive2('inactive')
        // }, 1000)
        // setSidebarOpen('flex')
        setBoardLogoNavDiv1('none')
        setBoardLogoNavDiv2('320px')
        // setBigNavDiv('1040px')
    }

    const onSidebarButtonClickedClosed = () => {
                  setWidth(`calc(${wide}px + 320px)`)

        setIsActive('inactive')
        //         setIsActive2('inactive')
        // setTimeout(() => {
        //     setSidebarOpen('none')
        // }, 1000);
        //         setTimeout(() => {
        //     setIsActive2('active')
        // }, 1000)
        // setSidebarOpen('none')
        setBoardLogoNavDiv1('solid 1px rgb(228, 235, 250)') ///////
        setBoardLogoNavDiv2('') ///////
        // setBigNavDiv('100%')
    }
    const navigate = useNavigate()
    // const location = useLocation();

    let menuRef = useRef();
    let menuRef2 = useRef();

    const { id } = useParams()

    const board = useSelector(state => selectBoardById(state, id))

    let content

    let mainColumnsContainerValue

    let classValue

    // let onVerticalIconClicked

    let disabled

    let disabled2

    useEffect(() => {
        if (wide <= 470) {
            setSidebarClosed('none')

        } else if (sidebarOpen === "flex") {
            setSidebarClosed('none')

        } else {
            setSidebarClosed('flex')

        }
    }, [wide, sidebarOpen])

    if (board) {


        !board.columns.length || (wide <= 470 && chevronClicked) ? disabled = true : disabled = false

        if (board.columns.length) {
            mainColumnsContainerValue = (
                <>
                    <ColumnsList
                        backgroundColor1={backgroundColor1}
                        textColor={textColor}
                    />
                    <div className="columnsContainerPlus">
                        <div className="columnNamePlus">
                            <span style={{ backgroundColor: backgroundColor2 }}></span>
                            <p style={{ color: backgroundColor2 }}>DONE (6)</p>
                        </div>
                        <div className='taskBoxPlus'
                            onClick={() => { navigate(`/board/${id}/editboard`) }}
                            style={{ backgroundColor: backgroundColor1 }}>
                            <h4>+ New Column</h4>
                        </div>
                    </div>
                </>
            )
            classValue = `mainColumnsContainer 
            // ${isActive}
            `;
        } else {
            mainColumnsContainerValue = (
                <>
                    <p>This board is empty. Create a new column to get started.</p>
                    <button onClick={() => { navigate(`/board/${id}/editboard`) }}>+ Add New Column</button>
                </>
            );
            classValue = "mainColumnsContainer2";
        }

        content = (
            // <div className="bigMainColumnsContainer">
            <div className={classValue} style={{ backgroundColor: backgroundColor2 }}>
                {mainColumnsContainerValue}
                <div className={`sidebarClosedButton 
                // ${isActive}
                `}
                    style={{ display: wide <= 470 ? "none" : null }}
                    onClick={onSidebarButtonClicked}>
                    <img src={iconShowSidebar} alt="" />
                </div>
            </div>
            //</div>
        )

    } else {
        content = (
            // <div className="bigMainColumnsContainer">
            <div className={`mainColumnsContainer 
            // ${isActive}
            `}
                style={{ justifyContent: "center", alignItems: "center", backgroundColor: backgroundColor2 }}>
                <h1>Choose a Board</h1>
                <div className={`sidebarClosedButton 
                // ${isActive}
                `}
                    // style={{ display: sidebarClosed }}
                    onClick={onSidebarButtonClicked}>
                    <img src={iconShowSidebar} alt="" />
                </div>
            </div>
            // </div> 
        )
        // onVerticalIconClicked = null

        disabled = true
    }

    
    let imgCursor
    
    let imgCursor2


    if (window.location.pathname === "/board") {
        disabled = true
        imgCursor = "none"
    }

    useEffect(() => {
        let handler = (e) => {
            if (wide > 470 && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
                // console.log(menuRef.current);
            }
            if (wide <= 470 && !menuRef2.current.contains(e.target)) {
                setIsOpen(false);
                // console.log(menuRef.current);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }

    });

        if (window.location.pathname === `/board/${id}`) {
        disabled2 = false
        imgCursor2 = "none"
        } else {
                   disabled2 = true
        imgCursor2 = "pointer"
    }

    console.log(isOpen);
    return (

        <>

            <header style={{ backgroundColor: wide <= 470 ? backgroundColor1 : null }}>
                <div className='boardLogoNavDiv' style={{ borderBottom: boardLogoNavDiv1, width: boardLogoNavDiv2, backgroundColor: backgroundColor1, borderRight: pageWhite ? "solid 1px rgb(228, 235, 250)" : null, }}>
                    <img src={logodark} alt="" style={{ display: logodisplay === "none" ? "inline" : "none" }} />
                    <img src={logolight} alt="" style={{ display: logodisplay }} />
                </div>
                <div className='bigNavDiv' style={{ width: bigNavDiv, backgroundColor: backgroundColor1, borderBottom: pageWhite ? "solid 1px rgb(228, 235, 250)" : null }}>
                    <h1 style={{ color: textColor }}>Platform Launch</h1>
                    <div className='buttonNavDiv' >
                        <button disabled={disabled} onClick={() => { navigate(`/board/${id}/createtask`) }}>+ Add New Task</button>
                        <div ref={menuRef}>
                            <img style={{ cursor: imgCursor }} src={iconVerticalEllipsis} alt="" onClick={() => { setIsOpen(!isOpen) }} />
                            <div className={`editBoardBox ${isOpen? 'active' : 'inactive'}`} style={{
                                // display: !isOpen ? "none" : "flex",
                                backgroundColor: backgroundColor2
                            }}>
                                <p className='greyP' onClick={() => { navigate(`/board/${id}/editboard`) }}>Edit Board</p>
                                <p className='redP' onClick={() => { navigate(`/board/${id}/deleteboard`) }}>Delete Board</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='boardLogoNavDivMobile' style={{ color: textColor }}>
                    <img className='logoMobile' src={logoMobile} alt="" />
                    <h1>Platform Launch</h1>
                    <button className='chevronDownbutton' disabled={disabled2} style={{ cursor: imgCursor2 }}
                    onClick={() => {setChevronClicked(!chevronClicked)}} >
                    <img className={`chevronDown ${chevronClicked  ? 'active' : 'inactive'}`} src={chevronUp} alt=""/>
                    </button>
                </div>
                <div className='boardSecondNavDivMobile' >
                    <button disabled={disabled} onClick={() => { navigate(`/board/${id}/createtask`) }}><img src={addMobile} alt="" /></button>
                    <div ref={menuRef2}>
                        <button onClick={() => { setIsOpen(!isOpen) }} id='iconVerticalEllipsisButton' disabled={chevronClicked}><img style={{ cursor: imgCursor }} className='iconVerticalEllipsis' src={iconVerticalEllipsis} alt="" /></button>
                        <div className={`editBoardBox ${isOpen? 'active' : 'inactive'}`}
                            style={{ 
                                // display: !isOpen ? "none" : "flex", 
                                backgroundColor: backgroundColor2 }}>
                            <p className='greyP' onClick={() => { navigate(`/board/${id}/editboard`) }}>Edit Board</p>
                            <p className='redP' onClick={() => { navigate(`/board/${id}/deleteboard`) }}>Delete Board</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className={`mainContainer ${isActive} `} style={{width:width}}>
                <div className="overlay2" style={{ height: ((wide <= 470 && chevronClicked)) ? "calc(100% - 81px)" : "0px" }}
                    onClick={()=>setChevronClicked(!chevronClicked)}></div>
                <Outlet
                    context={{ backgroundColor1, textColor, backgroundColor2 }}
                />

                <div className={`sidebarOpen ${chevronClicked  ? 'active' : 'inactive'}`}
                    style={{
                        display: sidebarOpen,
                        backgroundColor: backgroundColor1, borderRight: pageWhite ? "solid 1px rgb(228, 235, 250)" : null
                    }}
                >
                    <BoardsList setSidebarOpen={setSidebarOpen} wide={wide} chevronClicked={chevronClicked} setChevronClicked={ setChevronClicked} />
                    <div className='toggleMainDiv'>
                        <div className='toggleDiv'
                            style={{ backgroundColor: backgroundColor2 }}>
                            <img src={iconLightTheme} alt="" />
                            <input
                                className='toggleCheckbox'
                                type="checkbox"
                                id="switch"
                                name="switch"
                                onChange={() => {
                                    setPageWhite(!pageWhite)
                                }}
                            /><label id="switch" htmlFor="switch">Toggle</label>
                            <img src={iconDarkTheme} alt="" />

                        </div>
                        <div className='clickSidebarOffDiv' onClick={onSidebarButtonClickedClosed}>
                            <img src={iconHideSidebar} alt="" />
                            <p>Hide SideBar</p>
                        </div>
                    </div>
                </div>                {content}

            </div>
        </>
    )
}

export default BoardLayout