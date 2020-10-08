import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import { USER_LOGOUT } from '../actionTypes/userTypes';
import M from 'materialize-css';

function BottomTab() {

    const userState = useSelector(state => state.user)
    let { user } = userState;

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    

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


    useEffect(() => {
        console.log(history);
        M.Modal.init(searchRef.current)
    }, [])

    const logout = () => {
        localStorage.clear();
        dispatch({type: USER_LOGOUT});
        history.push("/login");
    }

    return (
        <>
            <div id="modal1" className="modal" 
                style={{ color: "black" }} 
                ref={searchRef}>
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
        <div className="bottom-tab">
            <div className="bottom-tab-main">
                <div className="tab-menu">
                    { 
                        user?
                        (<>
                            <div>
                                <div className="item">
                                    <Link to="/">
                                        <i className="material-icons">home</i>
                                        <div>Home</div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <div
                                        data-target="modal1"
                                        className="modal-trigger"
                                    >
                                        <i 
                                            className="material-icons"
                                        >search</i>
                                        <div>Search</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <Link to="/myfollowingposts">
                                        <i className="material-icons">explore</i>
                                        <div>My Following</div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <Link to="/profile">
                                        {
                                            user?<img src={ user.profilePic } className="avatar2"></img>:
                                            <i className="material-icons">account_circle</i>
                                        }
                                        <div>Profile</div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <Link to="/create">
                                        <i className="material-icons">add_circle</i>
                                        <div>Add Post</div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <div>
                                        <i className="material-icons">exit_to_app</i>
                                    </div>
                                    <div>
                                        <button 
                                            style={{
                                                border: "none", 
                                                backgroundColor:"white", 
                                                padding: "0px"
                                            }}
                                            onClick = { logout }>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                        ):
                        (
                        <>
                            <div>
                                <div className="item">
                                    <Link to="/login">
                                        <i className="material-icons">forward</i>
                                        <div>Login</div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <Link to="/signup">
                                        <i className="material-icons">assignment_ind</i>
                                        <div>Sign Up</div>
                                    </Link>
                                </div>
                            </div>
                        </>
                        )

                    }
                    
                    
                            
                </div>
                
            </div>
        </div>
    </>
    )
}

export default BottomTab
