import {useState} from 'react';
import uuid from "uuid";
import axios from "axios";

const useAxios = (url) =>{
    const [data, setData] = useState([]);
    const getAxios = async () => {
        const response = await axios.get(url)
        console.log(response.data)
        setData(prevData => [...prevData,  { ...response.data , id: uuid() }]);
    };

    return [data, getAxios];
}

export default useAxios;