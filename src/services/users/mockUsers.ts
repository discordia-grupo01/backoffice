import type { PlatformUser } from "@/types/users.types";

/**
 * Usuarios simulados: todavia no existe el endpoint de listado en el backend.
 * Cuando exista, esta lista se reemplaza por una llamada al Gateway.
 */
export const MOCK_USERS: PlatformUser[] = [
  {
    id: "8847291",
    displayName: "Zephyr King",
    username: "zephyr_king#4821",
    email: "zephyr.k@proton.me",
    registeredAt: "2023-03-12",
    status: "suspended",
    reportsCount: 7,
    serversCount: 4,
  },
  {
    id: "2291048",
    displayName: "Luna Star",
    username: "luna_star#0091",
    email: "luna@example.com",
    registeredAt: "2022-11-05",
    status: "active",
    reportsCount: 0,
    serversCount: 2,
  },
  {
    id: "5514827",
    displayName: "Marco Ruiz",
    username: "marco_r#3310",
    email: "marco.ruiz@mail.com",
    registeredAt: "2024-01-18",
    status: "active",
    reportsCount: 1,
    serversCount: 2,
  },
  {
    id: "9012384",
    displayName: "Alix Vargas",
    username: "alix_v#7700",
    email: "alix.v@corp.io",
    registeredAt: "2021-07-22",
    status: "active",
    reportsCount: 0,
    serversCount: 4,
  },
  {
    id: "3387410",
    displayName: "CX Storm",
    username: "cx_storm#0033",
    email: "cx@storm.net",
    registeredAt: "2023-09-01",
    status: "active",
    reportsCount: 3,
    serversCount: 1,
  },
  {
    id: "7741023",
    displayName: "Dark Phoenix",
    username: "dark_p#1122",
    email: "dark.p@anon.com",
    registeredAt: "2022-04-14",
    status: "suspended",
    reportsCount: 12,
    serversCount: 2,
  },
];
