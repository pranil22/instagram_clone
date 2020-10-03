import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import Home from './components/screens/Home'
import Createpost from './components/screens/Createpost'
import { useDispatch, useSelector } from 'react-redux';
import { USER_LOGIN_SUCCESS } from './actionTypes/userTypes';
import UserProfile from './components/screens/UserProfile';
import MyFollowingPosts from './components/screens/MyFollowingPosts';
import BottomTab from './components/BottomTab';
import Blank from './components/screens/Blank';
import Followers from './components/screens/Followers';
import Followings from './components/screens/Followings';
import UserFollowers from './components/screens/UserFollowers';
import UserFollowings from './components/screens/UserFollowings';


function Routing() {
  const history = useHistory();
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.user);

  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    console.log(user1);

    if(user1) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: user1
      })
    }
    else {
      history.push("/login");
    }
  }, [])

  return (
    <Switch>
        <Route exact path="/" component={ Home }/>
        <Route path="/login" component={ Login }/>
        <Route path="/signup" component={ Signup }/>
        <Route exact path="/profile" component={ Profile }/>
        <Route path="/create" component={ Createpost }/>
        <Route path="/profile/:userId" component={ UserProfile }/>
        <Route path="/myfollowingposts" component={ MyFollowingPosts }/>
        <Route exact path="/followers" component = { Followers }/>
        <Route exact path="/followings" component = { Followings }/>
        <Route path="/followers/:userId" component = { UserFollowers }/>
        <Route path="/followings/:userId" component = { UserFollowings }/>
    </Switch>
  )

}

function App() {
  return (
    <BrowserRouter>
        <Navbar/>
        <Routing/>
        <Blank/>
        <BottomTab/>
        
    </BrowserRouter>
    
  );
}

export default App;
