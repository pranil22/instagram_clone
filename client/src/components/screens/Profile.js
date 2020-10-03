import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import getMyPosts from '../../actionCreators/getMyPosts';
import { FETCH_MY_POST_FAILED, FETCH_MY_POST_LOADING, FETCH_MY_POST_SUCCESS } from '../../actionTypes/postTypes';
import Loading from '../Loading';
import Modal from './Modal';

function Profile() {

    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector(state => state.myPosts)
    const { user } = useSelector(state => state.user)
    const [profilePic, setProfilePic] = useState("");
    const [image, setImage] = useState("");
    const [loading1, setLoading1] = useState(false);

    useEffect(() => {
        setLoading1(true);
        dispatch({type:FETCH_MY_POST_LOADING});

        fetch("/myposts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " +  JSON.parse(localStorage.getItem("token"))
            }
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if(data.error) {
                dispatch({
                    type: FETCH_MY_POST_FAILED,
                    payload: data.error
                });
            }

            dispatch({
                type: FETCH_MY_POST_SUCCESS,
                payload: data
            });

            setLoading1(false);
        })
        .catch((error) => {
            dispatch({
                type: FETCH_MY_POST_FAILED,
                payload: JSON.stringify(error)
            });
            setLoading1(false);
        })
    }, []);

    const renderPosts = () => {
        return (
            posts.map((post) => {
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


    const renderAccountDetails = () => {
        return (
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "10px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div style={{ padding: "5px" }}>
                    <img style={{ width: '140px', height: '140px', borderRadius: '70px' }} 
                        src={user?user.profilePic:"no"}
                        alt="profile_pic"
                    />
                    <button
                        style={{ border: "none", 
                            backgroundColor:"#1E88E5", 
                            color:"white", 
                            padding: "7px", 
                            borderRadius: "4px"
                        }}
                        onClick = { () => { dispatch({type:"SET", payload: true}) }}
                    >
                        Change Profile Picture
                        
                    </button>
                    
                </div>
                <div style= {{ width: "100%" }}>
                    <h5 style={{ marginLeft: "20px"}}>{ user?user.name:'Loading'}</h5>
                    <h6 style={{ marginLeft: "20px"}}>{ user?user.email:'Loading' }</h6>
                    <div
                        style={{ maxWidth: "100%", marginLeft: "20px", display: "flex",justifyContent:"space-between",flexWrap: "wrap"  , width: "100%" }}
                    >
                        <h6>{ posts[0]?posts.length:"0" } post</h6>
                        <h6>
                            <Link to="/followers">
                                { user?user.followers.length:0 } followers
                            </Link>
                        </h6>
                        <h6>
                            <Link to="/followings">
                                { user?user.followings.length:0 } following
                            </Link>
                        </h6>
                    </div>    
                </ div>
            </div>
        )
    }


    const renderCorrect = () => {
        return (
            <div
                style={{
                    maxWidth: "550px",
                    margin: "10px auto"
                }}
            >
                {
                    user?renderAccountDetails():<Loading message="Getting account details..."></Loading>
                }          

                <div className="gallery">
                    { posts[0] ? renderPosts(): "No Posts" }
                </div>

                <Modal></Modal>

            </div>
        )
    }

    return (
        <div>
            {
                loading1?<Loading message="Getting profile..."></Loading>:
                renderCorrect()
            }
        </div>
    )
}

export default Profile
