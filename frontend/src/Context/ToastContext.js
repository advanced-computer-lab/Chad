import { createContext } from "react";

const ToastContext = createContext({
  toasts: [],
  setToasts: () => {},
  addToasts: () => {},
});

export default ToastContext;
