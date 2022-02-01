import {useState} from 'react';
import uuid from "uuid";
import axios from "axios";

const useAxios = (url) =>{
    const [data, setData] = useState([]);
    const getAxios = async (endpoint = "") => {
        const response = await axios.get(`${url}${endpoint}`);
        setData(prevData => [...prevData,  { ...response.data , id: uuid() }]);
    };
    return [data, getAxios];
}

export default useAxios;