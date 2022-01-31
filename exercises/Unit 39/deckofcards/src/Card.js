import {useState} from "react";
import './Card.css';

function Card({name, image}){
    const [{angle, xPos, yPos}] = useState({
        angle: Math.random() * 90 - 45,
        xPos: Math.random() * 40 - 20,
        yPos: Math.random() * 40 - 20
    })

    const transform = `translate(${xPos}px, ${yPos}px) rotate(${angle}deg)`;

    return (
        <li className="Card">
            <img 
                className="Card-img"
                alt={name}
                src={image} 
                style={{transform}}/>
        </li>
    )
}

export default Card;