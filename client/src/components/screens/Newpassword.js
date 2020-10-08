import React, { useState} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';
import { USER_LOGIN_SUCCESS } from '../../actionTypes/userTypes';
import { useDispatch } from 'react-redux';
import Loading from '../Loading';

function NewPassword() {
    const { token } = useParams();
    const history = useHistory();
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const [process, setProcess] = useState(false);

    const logIn = (e) => {
        e.preventDefault();

        console.log(token);
        setProcess(true);
        setPassword("");

        fetch("/new-password", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
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
            else {
                console.log(data)
                M.toast({ html: data.message, classes: "#66bb6a green lighten-1"});
                history.push("/login");
            }
        })
        
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
                                    type="password" 
                                    placeholder="Enter New Password"
                                    value= { password } 
                                    onChange={ (e) => { setPassword(e.target.value)} }
                                />
                                <button 
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    type="submit"
                                    onClick= { logIn }    
                                >
                                    Change
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

export default NewPassword
