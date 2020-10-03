import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import postsFunc from '../../actionCreators/postsFunc';
import { ADD_COMMENT, LIKE_POST, LIKE_POST_LOADING, POST_DELETED, UNLIKE_POST, UNLIKE_POST_LOADING } from '../../actionTypes/postTypes';
import Loading from '../Loading';

function Home() {
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.user)
    const { posts, loading, error } = useSelector(state => state.posts);

    const [comment, setComment] = useState("");

    const [showComments, setShowComments] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);


    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            dispatch({type: POST_DELETED, payload: postId});
        })
    }

    const handleOnSubmit = (e, postId) => {
        e.preventDefault();
        setComment("");

        fetch("/comment", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            },
            body: JSON.stringify({postId, comment})
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            dispatch({type: ADD_COMMENT, payload: data});
        })
        .catch(err => {
            console.log(err);
        })
    }

    const like = (postId) => {
        
        setIsProcessing(true);
        dispatch({type: LIKE_POST_LOADING});        

        fetch("/like", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            },
            body: JSON.stringify({postId})
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
            dispatch({type: LIKE_POST, payload: data});
            setIsProcessing(false);
        })
        .catch((err) => {
            console.log(err);
        })
    }


    const unlike = (postId) => {
        dispatch({type: UNLIKE_POST_LOADING});
        setIsProcessing(true);

        fetch("/unlike", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            },
            body: JSON.stringify({postId})
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
            dispatch({type: UNLIKE_POST, payload: data});
            setIsProcessing(false);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        
        dispatch(postsFunc());
    
    }, [])



    const renderItems = () => {

        if(loading) {
            return <Loading message="Fetching Posts..."></Loading>
        }
        else if(error) {
            return <h1>
                { error }
            </h1>
        }
        else {

            if(!posts[0]) {
                return <h5>
                    No posts available 
                </h5>
            }

            return posts.map(post => {
                return (
                    <div key = { post._id } className="card home-card">
                        {console.log(post.postedBy.name)}
                        <h6> 
                            <img src = { 
                                    user._id !== post.postedBy._id?
                                    post.postedBy.profilePic:
                                    user.profilePic
                                } 
                                alt="Avatar"
                                className="avatar">
                            </img> 
                            {
                                user?
                                <Link to={ user._id !== post.postedBy._id?`/profile/${post.postedBy._id}`: '/profile'}>
                                    <b style={{ marginLeft: "5px" }}>
                                        { post.postedBy.name }
                                    </b>
                                </Link>:
                                "Loading"
                            } 
                            
                            {   
                                user._id === post.postedBy._id && 
                                <i style={{ float: 'right', cursor: "pointer" }} 
                                    className="material-icons"
                                    onClick = {() => { deletePost(post._id) }}
                                >
                                    delete
                                </i>
                            }
                        </h6>
                        <div className="card-image" 
                            onDoubleClick= { () => { 
                                if(!post.likes.includes(user._id)) {
                                    like(post._id);
                                }
                            }}>
                            <img 
                                src = { post.image } 
                                alt = "Image" 
                            />
                        </div>
                        <div className="card-content">
                            { 
                                post.likes.includes(user._id)?
                                <button style={{border: "none", backgroundColor:"white", padding: "0px"}}
                                    disabled={isProcessing}
                                    onClick = { () => { unlike(post._id) } }
                                >
                                    <i className="material-icons"  
                                        style={{ color: 'red', cursor: "pointer" }} 
                                        >
                                        favorite
                                    </i>
                                </button>
                                :
                                <button style={{border: "none", backgroundColor:"white", padding: "0px"}}
                                    disabled={isProcessing}
                                    onClick = { () => { like(post._id) }}
                                >
                                    <i className="material-icons" 
                                    style={{ cursor: "pointer" }}  
                                        >
                                        favorite_border
                                    </i>
                                </button>
                                
                            }
                            <span>  </span>
                            <i className="material-icons" 
                                style={{ cursor: "pointer" }} onClick = { () => { setShowComments(!showComments) }}>chat_bubble_outline
                            </i>
                            <div style={{ fontWeight: "200" }}>{ post.likes.length } Likes</div>
                            <h6 style={{ fontWeight: "500" }}>{ post.caption }</h6>
                            <div>
                                {   showComments?
                                    post.comments.map((comment) => {
                                        return (<p key={comment._id}>
                                            <span>
                                                <b>{ comment.postedBy.name }</b> { comment.comment }
                                            </span>
                                        </p>)
                                    }): 
                                    post.comments.slice(0,2).map((comment) => {
                                        return (<p key={comment._id}>
                                            <span>
                                                <b>{ comment.postedBy.name }</b> { comment.comment }
                                            </span>
                                        </p>)
                                    })
                                }
                            </div>
                            <form 
                                onSubmit={ (e) => { handleOnSubmit(e, post._id) } }
                            >
                                <div style={{ display: 'flex',  justifyContent: "space-between"}}>
                                    <input 
                                        type="text" 
                                        placeholder="Add comment"
                                        value = { comment } 
                                        onChange={ (e) => { setComment(e.target.value) } }
                                    /> 
                                    <button type="submit" style={{ border: "none", backgroundColor: "white" }}>
                                        <i className="material-icons">add</i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
    
                );
            })
        }
    }


    return (
        <div className="home">
            { renderItems() }
        </div>
    )
}

export default Home
