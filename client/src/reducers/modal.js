
const modalReducer = (state = {
    open: false
}, action) => {
    
    switch(action.type) {
        case "SET":
            return { ...state, open: action.payload }
        
        default: return state;

    }

}

export default modalReducer;