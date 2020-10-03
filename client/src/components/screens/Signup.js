import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css';

function Signup() {

    const history = useHistory();
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState(undefined);


    useEffect(() => {
        if(url) {
            createAccount();
        }
    }, [url])

    const createPost = (e) => {
        e.preventDefault();
        
        if(image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "dh8zahoqm");

            fetch("https://api.cloudinary.com/v1_1/dh8zahoqm/image/upload",{
                method: "POST",
                body: data
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setUrl(data.secure_url);
                createAccount();
            })
            .catch((err) => {
                console.log(err);
            })
        }
        else {
            createAccount();
        }

        

        console.log("this is it");
    }    

    const createAccount = () => {

        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");

        const regExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!regExpEmail.test(email)) {
            M.toast({html: "Invalid Email", classes: "#e53935 red darken-1"})
        }
        else {

            const postData = {
                name: firstname + " " + lastname,
                email,
                password
            }

            if(url) {
                postData.profilePic = url;
            }

            console.log(postData);

            fetch("/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postData)
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                if(data.error) {
                    M.toast({html: data.error, classes: "#e53935 red darken-1"});
                }
                else {
                    M.toast({ html: data.message, classes: "#66bb6a green lighten-1"});
                    history.push("/login");
                }
            })
            .catch(err => {
                console.log("Error");
                console.log(err);
            })
        }
        
    }



    return (
        <div className="mycard">
           <div className="card auth-card input-field">
                <h1 className="instagram">Instagram</h1> 
                <input 
                    type="text" 
                    placeholder="Firstname"
                    value={ firstname }
                    onChange={ (e) => { setFirstName(e.target.value) } }
                />
                <input 
                    type="text" 
                    placeholder="Lastname"
                    value={ lastname }
                    onChange={ (e) => { setLastName(e.target.value) } }
                />
                <input 
                    type="text" 
                    placeholder="Email"
                    value={ email }
                    onChange={ (e) => { setEmail(e.target.value) } }
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={ password }
                    onChange={ (e) => { setPassword(e.target.value) } }
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload</span>
                        <input 
                            type="file"
                            onChange={ (e) => { setImage(e.target.files[0]) } }
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input 
                            className="file-path validate" 
                            type="text"
                            placeholder="Profile Picture(Optional)"
                        />
                    </div>
                </div>
                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={ createPost }
                    type="submit"
                >
                    Signup
                </button>
                <Link to="/login">
                    <div className="links">Already have an account? Login</div> 
                </Link>
            </div>
        </div>
    )
}

export default Signup
