import React, { useState} from 'react'
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { USER_LOGIN_SUCCESS } from '../../actionTypes/userTypes';
import { useDispatch } from 'react-redux';
import Loading from '../Loading';

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const [process, setProcess] = useState(false);

    const logIn = (e) => {
        e.preventDefault();

        setProcess(true);
        setEmail("");
        setPassword("");

        const regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!regExpEmail.test(email)) {
            M.toast({html: "Invalid Email", classes: "#e53935 red darken-1"})
        }
        else {
            fetch("/signin", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                setProcess(false);
                if(data.error) {
                    M.toast({html: data.error, classes: "#e53935 red darken-1"})
                }
                else if(!data.token){
                    M.toast({html: "Something went wrong", classes: "#e53935 red darken-1"})
                }
                else {
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        payload: data.user
                    });
                    console.log(data)
                    localStorage.setItem("token", JSON.stringify(data.token));
                    localStorage.setItem("user", JSON.stringify(data.user));
                    M.toast({ html:"Logged In Successfully", classes: "#66bb6a green lighten-1"});
                    history.push("/");
                }
            })
        }
    }

    return (

        <div>
            {
                process?
                <Loading message="Wait a moment..."></Loading>:
                (
                    <div className="mycard">
                        <div className="card auth-card input-field">
                                <h1 className="instagram">Instagram</h1> 
                                <input 
                                    type="text" 
                                    placeholder="email"
                                    value={ email }
                                    onChange={ (e) => { setEmail(e.target.value)} }
                                />
                                <input
                                    type="password" 
                                    placeholder="password"
                                    value= { password } 
                                    onChange={ (e) => { setPassword(e.target.value)} }
                                />
                                <button 
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    type="submit"
                                    onClick= { logIn }    
                                >
                                    Login
                                </button>
                                <Link to="/signup">
                                    <div className="links">Don't have account? Create account</div> 
                                </Link>
                            </div>
                        </div>

                )
            }
            
            </div>

        
    )
}

export default Login
