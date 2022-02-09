import {useParams} from 'react-router-dom';
import Color from './Color';

function FilterColor({colors}){
    const {color} = useParams();
    if (color){
        const currColor = colors[color];
        return <Color name={color} color={currColor}/>
    }
    return null;
}

export default FilterColor;