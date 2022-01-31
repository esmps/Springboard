import React, { fireEvent, getByLabelText, render } from "@testing-library/react";
import ToDoList from './ToDoList';


//smoke test
it("renders without crashing", function() {
    render(<ToDoList />);
  });
  
  // snapshot test
  it("matches snapshot", function() {
    const {asFragment} = render(<ToDoList />);
    expect(asFragment()).toMatchSnapshot();
  });
  
  function addToDo(toDoList, text = "This is something I need to do."){
      const textInput = toDoList.getByLabelText("What do you need to do?");
      fireEvent.change(textInput, {target: {value: text}});
      const btn = toDoList.getByText("Add!");
      fireEvent.click(btn);
  }
  
  it("should add a new item", function() {
      const toDoList = render(<ToDoList />);
    
      // no items yet
      expect(toDoList.queryByText("X")).not.toBeInTheDocument();
    
      //add todo
      addToDo(toDoList);
    
      // item exists!
      const rmvBtn = toDoList.getByText("X");
      expect(rmvBtn).toBeInTheDocument();
      expect(rmvBtn.nextSibling).toHaveTextContent("This is something I need to do.")
    });
  
  it("should remove a todo", function() {
      const toDoList = render(<ToDoList />);
      addToDo(toDoList);
  
      const rmvBtn = toDoList.getByText("X");
      expect(rmvBtn).toBeInTheDocument();
  
      //click remove button
      fireEvent.click(rmvBtn);
      expect(rmvBtn).not.toBeInTheDocument();
      
  })