// utils/localStorage.js
export const getInitialState = (key, defaultState) => {
  if (typeof window !== "undefined") {
    const storedState = localStorage.getItem(key);
    return storedState ? JSON.parse(storedState) : defaultState;
  }
  return defaultState;
};
