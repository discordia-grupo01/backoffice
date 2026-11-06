declare module "phoenix" {
  export class Channel {
    on<T>(event: string, callback: (payload: T) => void): number;
    join(): { receive(event: string, callback: () => void): unknown };
    leave(): void;
  }

  export class Socket {
    constructor(
      endPoint: string,
      options?: {
        params?: Record<string, string>;
        reconnectAfterMs?: (tries: number) => number;
      },
    );
    connect(): void;
    onClose(callback: (event: unknown) => void): number;
    channel(topic: string, params: Record<string, unknown>): Channel;
    disconnect(callback?: () => void): void;
  }
}
