import { UPDATE_PIC } from "../actionTypes/postTypes";
import { USER_FOLLOW, USER_LOGIN_FALIED, USER_LOGIN_LOADING, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_UNFOLLOW } from "../actionTypes/userTypes";


const userReducer = (state = {
    user: null,
    loading: false,
    error: null
}, action) => {
    switch(action.type) {
        case UPDATE_PIC:
            return {...state, user: action.payload, loading: false, error: null};

        case USER_UNFOLLOW:
            return {...state,user: action.payload, loading: false, error: null};

        case USER_FOLLOW:
            return {...state,user: action.payload, loading: false, error: null};

        case USER_LOGIN_LOADING: 
            return {...state, user: null, loading: true, error: null}

        case USER_LOGIN_SUCCESS:
            return {...state, user: action.payload, loading: false, error: null}

        case USER_LOGIN_FALIED:
            return {...state, user: null, loading: false, error: action.payload}

        case USER_LOGOUT:
            return { ...state, user: null, loading: false, error: null };

        default: 
            return state;
    }    
}

export default userReducer;