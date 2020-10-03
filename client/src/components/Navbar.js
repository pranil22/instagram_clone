import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { USER_LOGOUT } from '../actionTypes/userTypes';
import Loading from './Loading';



function Navbar() {
    const userState = useSelector(state => state.user)
    let { user } = userState;

    const dispatch = useDispatch();
    const history = useHistory();

    
    const logout = () => {
        localStorage.clear();
        dispatch({type: USER_LOGOUT});
        history.push("/login");
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={ user?'/':'/login' } className="brand-logo left" >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/196px-Instagram_logo.svg.png" alt="logo"/>
                </Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    { user? 
                        [ 
                            <li key="myfollowingosts">
                                <Link to="/myfollowingposts">
                                    My Following Posts
                                </Link>
                            </li>,
                            <li key="profile">
                                <Link to="/profile">
                                    Profile
                                </Link>
                            </li>,
                            <li key="createPost">
                                <Link to="/create">
                                    Create Post
                                </Link>
                            </li>,
                            <button key="logout" 
                                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                type="button"
                                onClick = { logout }
                            >
                                Logout
                            </button> 
                        ] : 
                        [
                            <li key="login"><Link to="/login">Login</Link></li>,
                            <li key="signup"><Link to="/signup">Signup</Link></li>
                        ]
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
