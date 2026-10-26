import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PaginationBar } from "./PaginationBar";

describe("PaginationBar", () => {
  it("muestra el rango de la página junto al paginador", () => {
    render(
      <PaginationBar
        page={2}
        pageSize={12}
        total={30}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("13-24 de 30")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Paginación" }),
    ).toBeInTheDocument();
  });

  it("no se muestra si entra todo en una página", () => {
    const { container } = render(
      <PaginationBar
        page={1}
        pageSize={12}
        total={12}
        onPageChange={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
