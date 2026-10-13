"use client";

import { useEffect, useState } from "react";

export type StaffAccess = "checking" | "granted" | "denied";

/**
 * Mientras el JWT no traiga el rol, se simula: por defecto es staff y
 * `localStorage["discordia:mock-role"] = "user"` permite ver la pantalla de
 * "sin permisos". El rechazo real lo tiene que dar el back.
 */
const MOCK_ROLE_KEY = "discordia:mock-role";

function readMockRole(): "staff" | "user" {
  try {
    return localStorage.getItem(MOCK_ROLE_KEY) === "user" ? "user" : "staff";
  } catch {
    return "staff";
  }
}

export function useStaffAccess(): StaffAccess {
  const [access, setAccess] = useState<StaffAccess>("checking");

  useEffect(() => {
    setAccess(readMockRole() === "staff" ? "granted" : "denied");
  }, []);

  return access;
}
