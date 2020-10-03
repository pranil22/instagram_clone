import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import { USER_LOGOUT } from '../actionTypes/userTypes';

function BottomTab() {

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
                                    <Link to="/myfollowingposts">
                                        <i className="material-icons">explore</i>
                                        <div>My Following</div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="item">
                                    <Link to="/profile">
                                        <i className="material-icons">account_circle</i>
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
                                    <i className="material-icons">exit_to_app</i>
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
    )
}

export default BottomTab
