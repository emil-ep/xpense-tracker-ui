declare global {
  interface Window {
    tracker?: {
      userCurrency?: string;
      // add more fields here if needed
    };
  }
}

export {};