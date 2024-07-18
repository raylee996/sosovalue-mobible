declare global {
  interface Window {
    sensors: {
      login: (userId: string) => void;
      logout: () => void;
      quick: (type: string, params?: object) => void;
      registerPage: (obj: object) => void;
      track: (key: string, obj: object) => void;
    };
    safepalProvider: {
      removeAllListeners: () => void;
      request: (params: { method: string; params?: string[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

export {};
