import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("muestra la inicial si no hay imagen", () => {
    const { container } = render(<Avatar name="Beto" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("B");
  });

  it("muestra la imagen si hay src", () => {
    const { container } = render(
      <Avatar name="Beto" src="https://cdn.example.com/b.png" />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn.example.com/b.png",
    );
  });

  it("vuelve a la inicial si la imagen no carga, y reintenta con otra src", () => {
    const { container, rerender } = render(
      <Avatar name="Beto" src="https://cdn.example.com/rota.png" />,
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("B");

    rerender(<Avatar name="Beto" src="https://cdn.example.com/nueva.png" />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn.example.com/nueva.png",
    );
  });
});
