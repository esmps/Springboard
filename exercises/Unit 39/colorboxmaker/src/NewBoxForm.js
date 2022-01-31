import React, {useState} from "react";
import { v4 as uuid } from 'uuid';

function NewBoxForm({ newBox }){
    const [formData, setFormData] = useState({
        height: "",
        width: "",
        backgroundColor: ""
    });

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
          ...formData,
          [name]: value
        }));
    };

    const gatherInput = evt => {
        evt.preventDefault();
        newBox({...formData, id: uuid()})
        setFormData({
            height: "",
            width: "",
            backgroundColor: ""
        })
    }

    return (
        <form onSubmit={gatherInput}>
            <div>
                <label htmlFor="backgroundColor">Background Color:</label>
                <input 
                    onChange={handleChange}
                    name="backgroundColor"
                    id="backgroundColor"
                    type="text"
                    value={formData.backgroundColor}
                />
            </div>
            <div>
                <label htmlFor="width">Width:</label>
                <input 
                    onChange={handleChange}
                    name="width"
                    id="width"
                    type="text"
                    value={formData.width}
                />
            </div>
            <div>
                <label htmlFor="height">Height:</label>
                <input 
                    onChange={handleChange}
                    name="height"
                    id="height"
                    type="text"
                    value={formData.height}
                />
            </div>
            <button id="btn-newBox">Add!</button>
        </form>
    )
}

export default NewBoxForm;