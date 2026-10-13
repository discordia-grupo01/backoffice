import { describe, expect, it } from "vitest";

import type { PlatformUser } from "@/types/users.types";

import {
  EMPTY_USER_FILTERS,
  filterUsers,
  hasActiveFilters,
} from "./userFilters";

function buildUser(overrides: Partial<PlatformUser>): PlatformUser {
  return {
    id: "1",
    displayName: "Luna Star",
    username: "luna_star#0091",
    email: "luna@example.com",
    registeredAt: "2022-11-05",
    status: "active",
    reportsCount: 0,
    serversCount: 2,
    ...overrides,
  };
}

const luna = buildUser({});
const jose = buildUser({
  id: "2",
  displayName: "José Pérez",
  username: "jose_p#1000",
  email: "jose@mail.com",
});
const zephyr = buildUser({
  id: "3",
  displayName: "Zephyr King",
  username: "zephyr_king#4821",
  email: "zephyr.k@proton.me",
  status: "suspended",
});
const USERS = [luna, jose, zephyr];

describe("filterUsers", () => {
  it("sin filtros devuelve todos los usuarios", () => {
    expect(filterUsers(USERS, EMPTY_USER_FILTERS)).toEqual(USERS);
  });

  it("busca por email", () => {
    const result = filterUsers(USERS, { query: "proton.me", status: "all" });
    expect(result).toEqual([zephyr]);
  });

  it("busca por nombre sin distinguir mayúsculas ni tildes", () => {
    const result = filterUsers(USERS, { query: "JOSE perez", status: "all" });
    expect(result).toEqual([jose]);
  });

  it("busca por nombre de usuario", () => {
    const result = filterUsers(USERS, { query: "luna_star", status: "all" });
    expect(result).toEqual([luna]);
  });

  it("ignora los espacios alrededor de la búsqueda", () => {
    const result = filterUsers(USERS, { query: "  luna  ", status: "all" });
    expect(result).toEqual([luna]);
  });

  it("filtra solo los usuarios suspendidos", () => {
    const result = filterUsers(USERS, { query: "", status: "suspended" });
    expect(result).toEqual([zephyr]);
  });

  it("filtra solo los usuarios activos", () => {
    const result = filterUsers(USERS, { query: "", status: "active" });
    expect(result).toEqual([luna, jose]);
  });

  it("combina búsqueda y estado", () => {
    expect(filterUsers(USERS, { query: "zephyr", status: "active" })).toEqual(
      [],
    );
    expect(
      filterUsers(USERS, { query: "zephyr", status: "suspended" }),
    ).toEqual([zephyr]);
  });
});

describe("hasActiveFilters", () => {
  it("es falso sin búsqueda y con todos los estados", () => {
    expect(hasActiveFilters(EMPTY_USER_FILTERS)).toBe(false);
    expect(hasActiveFilters({ query: "   ", status: "all" })).toBe(false);
  });

  it("es verdadero con búsqueda o con un estado elegido", () => {
    expect(hasActiveFilters({ query: "luna", status: "all" })).toBe(true);
    expect(hasActiveFilters({ query: "", status: "active" })).toBe(true);
  });
});
