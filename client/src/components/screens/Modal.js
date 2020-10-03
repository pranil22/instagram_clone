import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PIC } from '../../actionTypes/postTypes';

function Modal() {
    const { open } = useSelector(state => state.modal);
    const dispatch = useDispatch();
    const [image, setImage] = useState("");
    const { user } = useSelector(state => state.user)
    const [profilePic, setProfilePic] = useState(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if(profilePic) {
            updateProfile();    
        }
    }, [profilePic])

    const createPost = () => {
        setMsg("Uploading...");
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
            setProfilePic(data.secure_url);
        })
        .catch((err) => {
            console.log(err);
        })

        console.log("this is it");
    }

    
    const updateProfile = () => {
        fetch(`/updateProfile/${user._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + JSON.parse(localStorage.getItem("token"))
            },
            body: JSON.stringify({profilePic})
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setMsg("");
            localStorage.removeItem("user")
            localStorage.setItem("user", JSON.stringify(data));
            dispatch({type: UPDATE_PIC, payload: data});
            dispatch({type: "SET", payload: false});
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }


    return (
        <div>
            
            <div className="modal" style = {{ display: open?"block":"none" }}>

                <div className="modal-content">
                    <span className="close" onClick = { () => { dispatch({type:"SET", payload: false}) }}>
                        &times;
                    </span>
                    <div>
                        <h5>Change Profile</h5>
                        <input 
                            type="file"
                            onChange={ (e) => { setImage(e.target.files[0]) } }
                        />
                        <button style={{border: "none", 
                            backgroundColor:"#1E88E5", 
                            color:"white", 
                            padding: "7px", 
                            borderRadius: "4px",
                            margin: "10px"
                        }}
                            onClick = { () => {createPost()}}
                        >
                            Change
                        </button>
                        <p>{ msg }</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Modal
