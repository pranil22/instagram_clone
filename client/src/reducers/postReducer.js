import { ADD_COMMENT, FETCH_POST_FAILED, FETCH_POST_LOADING, FETCH_POST_SUCCESS, LIKE_POST, LIKE_POST_LOADING, POST_DELETED, UNLIKE_POST, UNLIKE_POST_LOADING } from "../actionTypes/postTypes";

const postReducer = (state = {
    posts: [],
    loading: false,
    error: null
}, action) => {
    switch(action.type) {

        case POST_DELETED:
            const ps3 = state.posts.filter((post) => {
                if(post._id !== action.payload) {
                    return post;
                }
            })
            return { ...state, posts: ps3, loading: false, error: null};
        

        case ADD_COMMENT:
            console.log(action.payload.comments);

            const ps2 = state.posts.map((post) => {
                if(post._id === action.payload._id) {
                    return { ...post, comments: action.payload.comments }
                }
                else {
                    return post;
                }
            })

            return { ...state, posts: ps2, loading: false, error: null};


        case LIKE_POST:
            const ps = state.posts.map((post) => {
                console.log(post);
                if(post._id === action.payload._id) {
                    return { ...post, likes: action.payload.likes }
                }
                else {
                    return post;
                }
            });

            console.log(ps);

            return { ...state, posts: ps, loading: false, error: null};

        case UNLIKE_POST:
            const ps1 = state.posts.map((post) => {
                if(post._id === action.payload._id) {
                    return { ...post, likes: action.payload.likes }
                }
                else {
                    return post;
                }
            });

            console.log(ps1);

            return { ...state, posts: ps1, loading: false, error: null};


        case FETCH_POST_FAILED:
            return {...state, posts: [], loading: false, error: action.payload}
        case FETCH_POST_LOADING:
            return {...state, posts: [], loading: true, error: null}
        case FETCH_POST_SUCCESS:
            return {...state, posts: action.payload, loading: false, error: null}
        
        default: return state;
    }
}

export default postReducer;