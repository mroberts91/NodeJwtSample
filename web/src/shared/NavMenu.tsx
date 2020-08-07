import React from 'react'
import { Link } from 'react-router-dom';

interface Props {

}

export const NavMenu: React.FC<Props> = () => {
     return (
        <div>
            <div className="top-row pl-4 navbar navbar-dark">
                <a className="navbar-brand" href="/">Node JWT Sample</a>
                <button className="navbar-toggler">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        
            <div>
                <ul className="nav flex-column">
                    <li className="nav-item px-3">
                        <Link to="/" className="nav-link">
                            <span className="oi oi-home" aria-hidden="true"></span> Home
                        </Link>
                    </li>
                    <li className="nav-item px-3">
                        <Link to="/login" className="nav-link">
                            <span className="oi oi-list-rich" aria-hidden="true"></span> Login
                        </Link>
                    </li>
                    <li className="nav-item px-3">
                        <Link to="/register" className="nav-link">
                            <span className="oi oi-plus" aria-hidden="true"></span> Register
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
     );
}