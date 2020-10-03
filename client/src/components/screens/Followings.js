import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { USER_PROFILE_FOLLOWING } from '../../actionTypes/userProfileTypes';
import { USER_FOLLOW } from '../../actionTypes/userTypes';
import Loading from '../Loading';


function Followings() {

    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);
    const { users, loading, error} = useSelector(state => state.followUsers);

    const { user } = useSelector(state => state.user);

    useEffect(() => {

        dispatch({type: "FETCH_USERS_LOADING"});

        fetch("/myfollowings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            dispatch({type:"FETCH_USERS_SUCCESS", payload: data});
        })
        .catch((err) => {
            dispatch({type: "FETCH_USERS_FAILED", payload: err});
        })

    }, [])


    
    const follow = (followId) => {
        setIsProcessing(true);

        fetch("/follow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            },
            body: JSON.stringify({followId})
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            localStorage.removeItem("user")
            localStorage.setItem("user", JSON.stringify(data))
            dispatch({type: USER_FOLLOW, payload: data});
            dispatch({type: USER_PROFILE_FOLLOWING, payload: user._id});
            setIsProcessing(false);
        })
    }

    
    const render = () => {
        if(loading) {
            return <Loading message="Getting users..."></Loading>
        }
        else if(error) {
            return <h4>
                {error}
            </h4>
        }
        else {
            return <div
                style={{
                    maxWidth: "300px",
                    margin: "50px auto"
                }}
            >

                {
                    users.map((user1) => {
                        return <div key={ user1._id }
                            style={{ display: "flex", 
                            justifyContent: "space-between",
                            borderBottom: "1px solid grey",
                            padding: "6px"
                        }}
                        >
                            
                            <div style={{ display: "flex"}}>
                                <div>
                                    <img src={ user1.profilePic } className="avatar1" alt="profilePic"/>
                                </div>
                                <div style={{ marginLeft: "3px" }}>
                                    <Link to={ user._id === user1._id?'/profile':`/profile/${user1._id}` }>
                                        <div>{ user1.name }</div> 
                                        <div>{ user1.email }</div>
                                    </Link>
                                    
                                </div>
                            </div>
                            { 
                                user._id === user1._id?null:
                                <div>
                                { 
                                    user.followings.includes(user1._id)?
                                    <button
                                        style={{ 
                                        border: "1px solid black",
                                        backgroundColor:"white", 
                                        color: "black", padding: "5px",
                                        borderRadius: "3px"
                                    }}
                                    disabled={isProcessing}
                                    >Following
                                    </button>:
                                    <button
                                        style={{border: "none", 
                                        backgroundColor:"#1e88e5", 
                                        color: "white", padding: "5px",
                                        borderRadius: "3px"
                                    }}
                                    disabled={isProcessing}
                                    onClick={() => { follow(user1._id) }}
                                    >Follow+
                                    </button>
                                }
                            </div>
                            }
                            
                        </div>
                    })
                }
            </div>

            
                
        }
    }


    return (
        <div>
            { render() }            
        </div>
    )
}

export default Followings
