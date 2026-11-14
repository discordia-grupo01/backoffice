import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({ env: { apiUrl: "https://api.example.com/" } }));

import { imageSrc } from "./imageSrc";

describe("imageSrc", () => {
  it("no devuelve nada si no hay imagen", () => {
    expect(imageSrc(null)).toBeNull();
    expect(imageSrc(undefined)).toBeNull();
    expect(imageSrc("")).toBeNull();
    expect(imageSrc("   ")).toBeNull();
  });

  it("usa tal cual una URL absoluta de Supabase Storage", () => {
    const url =
      "https://xyz.supabase.co/storage/v1/object/public/icons/s1-abc?v=abc";
    expect(imageSrc(url)).toBe(url);
  });

  it("le antepone el gateway a una ruta, sin duplicar la barra", () => {
    expect(imageSrc("/v1/servers/s1/icon?v=abc")).toBe(
      "https://api.example.com/v1/servers/s1/icon?v=abc",
    );
    expect(imageSrc("/uploads/profile-images/u1.png")).toBe(
      "https://api.example.com/uploads/profile-images/u1.png",
    );
  });

  it("descarta lo que no es URL ni ruta", () => {
    expect(imageSrc("javascript:alert(1)")).toBeNull();
    expect(imageSrc("data:image/png;base64,AAAA")).toBeNull();
  });
});
