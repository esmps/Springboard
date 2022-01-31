import React from "react";
import { fireEvent, getByLabelText, render } from "@testing-library/react";
import BoxList from "./BoxList";

//smoke test
it("renders without crashing", function() {
  render(<BoxList />);
});

// snapshot test
it("matches snapshot", function() {
  const {asFragment} = render(<BoxList />);
  expect(asFragment()).toMatchSnapshot();
});

function addBox(boxList, height = "2", width = "3", color = "pink"){
    const heightInput = boxList.getByLabelText("Height:");
    const widthInput = boxList.getByLabelText("Width:");
    const backgroundInput = boxList.getByLabelText("Background Color:");
    fireEvent.change(heightInput, {target: {value: height}});
    fireEvent.change(widthInput, {target: {value: width}});
    fireEvent.change(backgroundInput, {target: {value: color}});
    const btn = boxList.getByText("Add!");
    fireEvent.click(btn);
}

it("should add a new item", function() {
    const boxList = render(<BoxList />);
  
    // no items yet
    expect(boxList.queryByText("X")).not.toBeInTheDocument();
  
    //add box
    addBox(boxList);
  
    // item exists!
    const rmvBtn = boxList.getByText("X");
    expect(rmvBtn).toBeInTheDocument();
    expect(rmvBtn.previousSibling).toHaveStyle(
        `height: 2em;
        width: 3em;
        backgroundColor: pink`)
  });

it("should remove a color box", function() {
    const boxList = render(<BoxList />);
    addBox(boxList);

    const rmvBtn = boxList.getByText("X");
    expect(rmvBtn).toBeInTheDocument();

    //click remove button
    fireEvent.click(rmvBtn);
    expect(rmvBtn).not.toBeInTheDocument();
    
})