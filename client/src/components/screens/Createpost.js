import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { useDispatch, useSelector } from 'react-redux';
import postsFunc from '../../actionCreators/postsFunc';
import Loading from '../Loading';


function Createpost() {

    const history = useHistory();
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [process, setProcess] = useState(false);
    const [message, setMessage] = useState("");

    const dispatch = useDispatch()

    useEffect(() => {

        if(url) {
            setMessage("Creating Post...")
            const postData = { 
                caption,
                pic: url
             };
    
             console.log(JSON.parse(localStorage.getItem("token")));
    
            fetch("/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " +  JSON.parse(localStorage.getItem("token"))
                },
                body: JSON.stringify(postData)
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    setProcess(false);
                    M.toast({html: data.error, classes: "#e53935 red darken-1"})
                }
                else {
                    console.log(data);
                    history.push("/");
                    M.toast({ html:"Post Created", classes: "#66bb6a green lighten-1"});
                    dispatch(postsFunc());
                }
    
            });  
        }
                
    }, [url])

    const createPost = () => {
        setProcess(true);
        setMessage("Uploading Picture...")
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
        })
        .catch((err) => {
            console.log(err);
        })

        console.log("this is it");
    }

    return (
        <div>
            {
                process?
                <Loading message={message}></Loading>:
                <div className="card input-field"
                        style={{ 
                            margin: "30px auto", 
                            maxWidth: "500px", 
                            padding: "20px",
                            textAlign: "center"
                            
                        }}
                    >
                        <input 
                            type="text" 
                            placeholder="caption"
                            value = { caption }   
                            onChange={ (e) => { setCaption(e.target.value) }}                     
                        />
                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Upload Image</span>
                                <input 
                                    type="file"
                                    onChange={ (e) => { setImage(e.target.files[0]) } }
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                        </div>
                        <button 
                            className="btn waves-effect waves-light #64b5f6 blue darken-1"
                            onClick = { createPost }
                        >
                                Post
                        </button>
                    </div>

            }
        </div>

        
    )
}

export default Createpost
