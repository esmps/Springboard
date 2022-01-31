import { render } from "@testing-library/react";
import NewToDoForm from "./NewToDoForm";

//smoke test
it("renders without crashing", function() {
  render(<NewToDoForm />);
});

// snapshot test
it("matches snapshot", function() {
  const {asFragment} = render(<NewToDoForm />);
  expect(asFragment()).toMatchSnapshot();
});