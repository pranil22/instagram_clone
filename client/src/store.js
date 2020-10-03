import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import followUsersReducer from './reducers/followUsersReducer';
import modalReducer from './reducers/modal';
import myPostReducer from './reducers/myPostReducer';

import postReducer from './reducers/postReducer';
import userProfileReducer from './reducers/userProfileReducer';
import userReducer from './reducers/userReducer';

const initialState = {};

const reducers = combineReducers({
    posts: postReducer,
    user: userReducer,
    myPosts: myPostReducer,
    userProfile: userProfileReducer,
    modal: modalReducer,
    followUsers: followUsersReducer
});


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);


const store = createStore(reducers, initialState, enhancer);

export default store;