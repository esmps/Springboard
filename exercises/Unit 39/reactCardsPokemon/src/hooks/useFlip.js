import {useState} from 'react';

const useFlip = () =>{
    const [value, setValue] = useState(true);
    const flip = () => {
        setValue(value => !value);
    };

    return [value, flip];
}

export default useFlip;