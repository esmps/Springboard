import {Link} from 'react-router-dom';
import './Color.css';

function Color({name, color}){
    return (
        <div className="Color" style={{backgroundColor: color}}>
            <h1>This color is {name}</h1>
            <h3>
                <Link to="/colors">Back to List of Colors</Link>
            </h3>
        </div>
    )
}

export default Color;