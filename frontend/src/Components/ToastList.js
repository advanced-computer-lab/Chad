import { useContext } from "react";
import Toast from "./Toast";
import ToastContext from "../Context/ToastContext";
import "../Styles/Components/ToastList.scss";

function ToastList() {
  const { toasts, setToasts } = useContext(ToastContext);

  const handleRemove = (_id) => {
    setToasts((prev) => prev.filter(({ id }) => id !== _id));
  };

  return (
    <div className="toast-list">
      {toasts.map((t, i) => (
        <Toast key={`toast-${i}`} data={t} id={t.id} onRemove={handleRemove} />
      ))}
    </div>
  );
}

export default ToastList;
