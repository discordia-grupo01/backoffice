import { api } from "@/lib/browserApiClient";

export async function fetchNotificationSocketTicket(): Promise<string | null> {
  try {
    const { data, status } = await api.post<{ ticket?: string }>(
      "/notifications/socket-tickets",
    );
    return status === 200 && typeof data.ticket === "string"
      ? data.ticket
      : null;
  } catch {
    return null;
  }
}
