
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Extend render to always include providers
const customRender = (ui: ReactNode, options = {}) =>
  render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
    options
  );

// re-export everything from RTL
export * from "@testing-library/react";
export { customRender as render };
