import React from 'react'
import '../App.css';

function Loading(props) {
    return (
        <div
            style = {{
                width: "300px",
                textAlign: "center",
                margin: "auto",
                marginTop: "100px"
            }}
        >
            <div className="lds-heart">
                <div>
                </div>
            </div>
            <p>
                {props?props.message:null}
            </p>  
        </div>
    )
}

export default Loading
