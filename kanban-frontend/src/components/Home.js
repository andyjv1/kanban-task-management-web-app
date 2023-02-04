import { Link } from 'react-router-dom'
import logodark from "../features/assets/logo-dark.svg";

import React from 'react'

export default function Home() {
    return (
        <div className='homeMainDiv'>
            <div className='logoDiv'>
                <img src={logodark} alt="" />
            </div>
            <div>
                <Link className='homeLink' to="/board">See Boards</Link>
            </div>
        </div>
    )
}