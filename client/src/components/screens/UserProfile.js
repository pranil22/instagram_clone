import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { USER_PROFILE_FAILED, USER_PROFILE_FOLLOWING, USER_PROFILE_LOADING, USER_PROFILE_SUCCESS, USER_PROFILE_UNFOLLOWING } from '../../actionTypes/userProfileTypes';
import { USER_FOLLOW, USER_UNFOLLOW } from '../../actionTypes/userTypes';
import Loading from '../Loading';

function UserProfile() {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user)
    const userProfile = useSelector(state => state.userProfile);
    const { userId } = useParams();
    const [isProcessing, setIsProcessing] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setLoading(true);
        console.log(userId);
        dispatch({type:USER_PROFILE_LOADING});

        fetch(`/user/${userId}`, {
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
            if(data.error) {
                dispatch({type: USER_PROFILE_FAILED, payload: data.error});
            }
            else {
                console.log(data);
                dispatch({type: USER_PROFILE_SUCCESS, payload: data});
            }
            setLoading(false);
        })
        .catch((err) => {
            dispatch({type:USER_PROFILE_FAILED, payload: err});
            setLoading(false);
            
        })
    }, [])

    const renderFollowOrUnfollow = () => {
        if(userProfile.user) {
            if(userProfile.user.followers.includes(user._id)) {
                return <button
                    disabled = {isProcessing} 
                    style={{ marginLeft: "20px" }}
                    className="waves-effect waves-light #1e88e5 blue darken-1 btn"
                    onClick = { () => { unfollow(userProfile.user._id) } }
                >
                    Unfollow
                </button>
            }
            else {
                return <button 
                    disabled = {isProcessing} 
                    style={{ marginLeft: "20px" }}
                    className="waves-effect waves-light #1e88e5 blue darken-1 btn"
                    onClick = { () => { follow(userProfile.user._id) } }
                >
                    Follow
                </button>
            }
        }
        else {
            return null;
        }
    }

    const unfollow = (followId) => {
        setIsProcessing(true);

        fetch("/unfollow", {
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
            setIsProcessing(false);
            console.log(data);
            localStorage.removeItem("user")
            localStorage.setItem("user", JSON.stringify(data))
            dispatch({type: USER_UNFOLLOW, payload: data});
            dispatch({type: USER_PROFILE_UNFOLLOWING, payload: user._id});
        })
    }

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
            setIsProcessing(false);
            localStorage.removeItem("user")
            localStorage.setItem("user", JSON.stringify(data))
            dispatch({type: USER_FOLLOW, payload: data});
            dispatch({type: USER_PROFILE_FOLLOWING, payload: user._id});
        })
    }

    const renderPosts = () => {
        return (
            userProfile.posts.map((post) => {
                return (
                    <img
                        key = { post._id } 
                        src = { post.image } 
                        alt = ""
                    />
                )
            })

        )
    }


    const renderCorrect = () => {
        return (
            <div key="user_profile"
                style={{
                    maxWidth: "550px",
                    margin: "10px auto"
                }}
            >
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "10px 0px",
                    borderBottom: "1px solid grey"
                }}>
                    <div>
                        <img style={{ width: '160px', height: '160px', borderRadius: '80px' }} 
                            src = { userProfile.user?userProfile.user.profilePic: 'no'}
                            alt = "profile_pic"
                        />
                    </div>
                    <div style= {{ width: "100%" }}>
                        <h5 style={{ marginLeft: "20px"}}>
                            { userProfile.user?userProfile.user.name:'Loading...'}
                        </h5>
                        <div
                            style={{ 
                                maxWidth: "100%", 
                                marginLeft: "20px", 
                                display: "flex",
                                justifyContent:"space-between",
                                width: "100%"
                            }}
                        >
                            <h6>{ 
                                userProfile.posts[0]?userProfile.posts.length:"0" } post
                            </h6>
                            { 
                                userProfile.user?
                                <>
                                    <h6>
                                        <Link to={`/followers/${userProfile.user._id}`}>
                                            { userProfile.user?userProfile.user.followers.length:0 } followers
                                        </Link>
                                    </h6>
                                    <h6>
                                        <Link to={`/followings/${userProfile.user._id}`}>
                                            { userProfile.user?userProfile.user.followings.length:0 } following
                                        </Link>
                                    </h6>
                                </>:
                                null
                            }
                            
                        </div>
                        <p>
                        {
                            renderFollowOrUnfollow()
                        }
                        </p>
                        
                    </ div>
                </div>
                
                

                <div className="gallery">
                    { userProfile.posts[0] ? renderPosts(): 'No Post' }
                </div>

            </div>
        )
    }
    
    return (
        <div>
            { 
                loading?<Loading message="Getting profile..."></Loading>:renderCorrect()
            }
        </div>
    )
}

export default UserProfile
