import { render } from "@testing-library/react";
import ToDo from "./ToDo";

//smoke test
it("renders without crashing", function() {
  render(<ToDo />);
});

// snapshot test
it("matches snapshot", function() {
  const {asFragment} = render(<ToDo />);
  expect(asFragment()).toMatchSnapshot();
});