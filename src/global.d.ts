declare global {
  interface Window {
    tracker?: {
      userCurrency?: string;
      username?: string;
      // add more fields here if needed
    };
  }
}

export {};
