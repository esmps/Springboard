import React from "react";

function Box({id, width, height, backgroundColor, handleRemove}){
    const divStyle = {
        width: `${width}em`, 
        height: `${height}em`, 
        backgroundColor
    };
    return (
       <div>
        <div style={divStyle}></div>
        <button onClick={() => handleRemove(id)}>X</button>
       </div>
    );
}
export default Box;