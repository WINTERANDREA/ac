export {};
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, any> }
    ) => void;
    gtag?: (...args: any[]) => void;
  }
}
