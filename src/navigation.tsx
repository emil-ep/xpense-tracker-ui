// navigation.ts
let navigateRef: (path: string) => void;

export const setNavigate = (navigate: (path: string) => void) => {
  navigateRef = navigate;
};

export const getNavigate = (): ((path: string) => void) => {
  return navigateRef;
};
