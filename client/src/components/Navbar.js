import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { USER_LOGOUT } from '../actionTypes/userTypes';
import M from 'materialize-css';


function Navbar() {
    const searchRef = useRef(null);
    const userState = useSelector(state => state.user)
    let { user } = userState;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("")

    const location = useLocation()

    const searchUsers = (user) => {
        setSearch(user);

        if(user.trim() === "") {
            console.log("Empty");
            setUsers([]);
            return;
        }

        fetch(`/search/${user}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setUsers(data);
            data.map((user) => {
                console.log(user.name);
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        console.log(location.pathname);
        console.log(history);
        M.Modal.init(searchRef.current)
    }, [])
    
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
                            <li key="search">
                                <i style={{ color: "black", cursor: "pointer" }} 
                                    data-target="modal1"
                                    className="material-icons modal-trigger">search</i>
                            </li>,
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
            <div id="modal1" className="modal" style={{ color: "black" }} ref={searchRef}>
                <div className="modal-content">
                    <input 
                         type="text" 
                        placeholder="Search Users"
                        value={ search }
                        onChange={ (e) => { searchUsers(e.target.value)} }
                    />

                    {
                        users[0]?<div>
                            {
                                users.map((user1) => {
                                    return <div 
                                        style={{  
                                            margin: "3px", 
                                            padding: "0px", 
                                            paddingLeft: "5px",
                                            borderBottom: "1px solid black",
                                            cursor: "pointer"
                                        }}
                                        key={ user1._id } 
                                        onClick={ () =>{ 
                                            M.Modal.getInstance(searchRef.current).close() 
                                            setSearch("");
                                            setUsers([]);
                                        } }
                                        >
                                            <Link to={ user._id === user1._id?'/profile':`/profile/${user1._id}`}>
                                                <img src={ user1.profilePic } className="avatar2"/>
                                                { user1.name }
                                            </Link>
                                            
                                    </div>
                                })
                            }
                        </div>: 
                        null
                    }
                  <button className="modal-close waves-effect waves-green btn-flat">
                      Close
                    </button>

                </div>
            </div>
        </nav>
    )
}

export default Navbar
