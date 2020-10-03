const { FETCH_POST_LOADING, FETCH_POST_FAILED, FETCH_POST_SUCCESS } = require("../actionTypes/postTypes")

const postsFunc = () => async (dispatch) => {

    dispatch({type: FETCH_POST_LOADING});

    fetch("/allposts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem("token"))
        }
    })
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        if(data.error) {
            dispatch({type: FETCH_POST_FAILED, payload: data.error});
        }
        else {
            console.log(data);
            dispatch({type: FETCH_POST_SUCCESS, payload: data});
        }
    })
    .catch(error => {
        dispatch({type:FETCH_POST_FAILED, payload:"Something went wrong"});
    })
} 

export default postsFunc;