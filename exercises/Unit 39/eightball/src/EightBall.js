import React, {useState} from 'react';
import "./EightBall.css"

const EightBall = ({answers}) => {
    const getRandomAnswer = () => {
        const idx = Math.floor(Math.random() * answers.length);
        return answers[idx];
    };
    const handleClick = () => {
        const answer = getRandomAnswer();
        setColor(answer.color);
        setMsg(answer.msg);
    };
    const resetBall = () => {
        setColor("black");
        setMsg("Think of a Question");
    }
    const [color, setColor] = useState("black");
    const [msg, setMsg] = useState("Think of a Question")
    return (
        <div>
            <div className="EightBall-ball" onClick={handleClick} style={{backgroundColor: color }}>
                <p className="EightBall-msg">{msg}</p>
            </div>
            <button onClick={resetBall}>Reset</button>
        </div>
    )
}

export default EightBall;