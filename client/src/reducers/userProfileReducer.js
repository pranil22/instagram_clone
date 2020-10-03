const { USER_PROFILE_LOADING, USER_PROFILE_SUCCESS, USER_PROFILE_FAILED, USER_PROFILE_FOLLOWING, USER_PROFILE_UNFOLLOWING } = require("../actionTypes/userProfileTypes");

const userProfileReducer = (state = {
    user: null,
    posts: [],
    loading: false,
    error: null 
}, action) => {

    switch(action.type) {
        case USER_PROFILE_UNFOLLOWING:
            const followers1 = state.user.followers.filter((id) => {
                if(id.toString() !== action.payload.toString()) {
                    return id;
                }
            })

            console.log(action.payload);
            console.log(followers1);

            return {
                ...state, 
                user: {...state.user, followers: followers1},
                loading: false,
                error: null
            }

        case USER_PROFILE_FOLLOWING:
            return {...state, 
                    user: {...state.user, followers: [...state.user.followers, action.payload]},
                    loading: false,
                    error: null
                }

        case USER_PROFILE_LOADING:
            return {...state, user: null, posts: [], loading: true, error: null}

        case USER_PROFILE_SUCCESS:
            console.log(action.payload.posts);
            return {...state, user: action.payload.user, posts: action.payload.posts, loading: false, error: action.payload}

        case USER_PROFILE_FAILED:
            return {...state, user: null, posts: [], loading: false, error: action.payload}

        default: return state;
    }

}

export default userProfileReducer;