import type {
  PlatformServiceId,
  ServiceHealth,
  ServiceHealthCheck,
} from "@/types/status.types";

// values: [healthy, unavailable, no_data]
const MOCK_CHECKS: readonly {
  service: PlatformServiceId;
  health: ServiceHealth;
  secondsAgo: number;
}[] = [
  { service: "identify", health: "healthy", secondsAgo: 8 },
  { service: "servers", health: "healthy", secondsAgo: 11 },
  { service: "messaging", health: "healthy", secondsAgo: 6 },
  { service: "notifications", health: "healthy", secondsAgo: 14 },
  { service: "voice", health: "healthy", secondsAgo: 9 },
  { service: "admin", health: "healthy", secondsAgo: 18 },
  { service: "metrics", health: "healthy", secondsAgo: 42 },
];

export function buildMockServiceHealth(now = Date.now()): ServiceHealthCheck[] {
  return MOCK_CHECKS.map(({ service, health, secondsAgo }) => ({
    service,
    health,
    checked_at: new Date(now - secondsAgo * 1000).toISOString(),
  }));
}
