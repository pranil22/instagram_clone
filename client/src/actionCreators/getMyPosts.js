const { FETCH_MY_POST_LOADING, FETCH_MY_POST_SUCCESS, FETCH_MY_POST_FAILED } = require("../actionTypes/postTypes")

const getMyPosts = () => async (dispatch) => {
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
    })
    .catch((error) => {
        dispatch({
            type: FETCH_MY_POST_FAILED,
            payload: JSON.stringify(error)
        });
    })
}

export default getMyPosts;