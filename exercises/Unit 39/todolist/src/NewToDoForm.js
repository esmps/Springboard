import {useState} from "react";
import { v4 as uuid } from 'uuid';
import './NewToDoForm.css'

function NewToDoForm({newToDo}){
    const [formData, setFormData] = useState({toDoText: ""});

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
          ...formData,
          [name]: value
        }));
    };

    const gatherInput = evt => {
        evt.preventDefault();
        if (formData.toDoText){
            newToDo({...formData, id: uuid()})
            setFormData({toDoText: ""});
        }
    }

    return (
        <form className="newToDoForm" onSubmit={gatherInput}>
            <div>
                <label 
                    className="newToDoForm-textareaLabel"
                    htmlFor="toDoText">
                        What do you need to do?
                </label>
                <br/>
                <textarea
                    onChange={handleChange}
                    name="toDoText"
                    id="toDoText"
                    className="newToDoForm-textarea"
                    value={formData.toDoText}
                >
                </textarea>
                
            </div>
            <button className="newToDoForm-btn" id="btn-newToDo">Add!</button>
        </form>
    )

}

export default NewToDoForm;