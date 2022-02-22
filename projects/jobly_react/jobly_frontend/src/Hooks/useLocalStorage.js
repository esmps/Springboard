import { useState,  useEffect } from "react";

function useLocalStorage(key, value = null){
    const initVal = localStorage.getItem(key) || value;

    const [item, setItem] = useState(initVal);

    useEffect( function setKeyToLocalStorage(){
        if (item === null){
            localStorage.removeItem(key);
        }else{
            localStorage.setItem(key, item);
        }
    }, [key, item])

    return [item, setItem]
}

export default useLocalStorage;