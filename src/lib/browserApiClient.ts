import axios from "axios";

/**
 * Instancia de axios compartida por todos los `services/<x>/client.ts`.
 * Le pega al BFF (`/api/*`, mismo origen), nunca al Gateway.
 */
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  validateStatus: () => true,
});
