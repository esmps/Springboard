import './ToDo.css'
function ToDo({id, text, handleRemove}){
    return (
       <li className="ToDo">
        <button className="ToDo-button" onClick={() => handleRemove(id)}>X</button>
        <p className="ToDo-text">{text}</p>
       </li>
    );
}
export default ToDo;