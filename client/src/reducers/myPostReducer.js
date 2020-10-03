const { FETCH_MY_POST_FAILED, FETCH_MY_POST_SUCCESS, FETCH_MY_POST_LOADING } = require("../actionTypes/postTypes");

const myPostReducer = (state = {
    posts: [],
    loading: false,
    error: null
}, action) => {
    switch(action.type) {

        case FETCH_MY_POST_FAILED:
            return {...state, posts: [], loading: false, error: action.payload};


        case FETCH_MY_POST_SUCCESS:
            return {...state, posts: action.payload, loading: false, error: null};


        default: 
            return state;
    }
}

export default myPostReducer;