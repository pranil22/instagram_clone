const followUsersReducer = (state = {
    users: [],
    loading: false,
    error: null
}, action) => {
    switch(action.type) {
        case "FETCH_USERS_SUCCESS":
            return {...state, users: action.payload, loading: false, error: null};

        case "FETCH_USERS_LOADING":
            return {...state, users: [], loading: true, error: null};

        case "FETCH_USERS_FAILED":
            return {...state, users: [], loading: false, error: action.payload};

        default: return state;
    }
}

export default followUsersReducer;