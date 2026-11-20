import type { NavigateFunction } from 'react-router-dom';

let navigateRef: NavigateFunction;

export const setNavigate = (navigate: NavigateFunction) => {
  navigateRef = navigate;
};

export const getNavigate = (): NavigateFunction => {
  return navigateRef;
};
