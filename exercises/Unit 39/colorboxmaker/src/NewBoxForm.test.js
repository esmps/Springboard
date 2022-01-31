import React from "react";
import { render, fireEvent } from "@testing-library/react";
import NewBoxForm from "./NewBoxForm";

//smoke test
it("renders without crashing", function() {
  render(<NewBoxForm />);
});

// snapshot test
it("matches snapshot", function() {
  const {asFragment} = render(<NewBoxForm />);
  expect(asFragment()).toMatchSnapshot();
});
