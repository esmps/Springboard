import {useState} from "react";
import NewToDoForm from "./NewToDoForm";
import ToDo from "./ToDo";

function ToDoList(){
    const [todos, setTodos] = useState([]);
    const add = toDoObj => {
        setTodos(todos => [...todos, toDoObj])
    };
    const remove = id => {
        setTodos(todos => todos.filter(todo => todo.id !== id));
    }

    const todoList = todos.map(todo => (
        <ToDo
            key={todo.id}
            id={todo.id}
            text={todo.toDoText}
            handleRemove={remove}
        />
    ));

    return (
        <>
        <NewToDoForm newToDo={add}/>
        <h3>TO DO LIST:</h3>
        <ul>
            { todoList }
        </ul>
        </>
    );

}

export default ToDoList;