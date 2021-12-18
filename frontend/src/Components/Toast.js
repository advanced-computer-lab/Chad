import { useEffect } from "react";
import "../Styles/Components/Toast.scss";

function Toast({ id, data, onRemove }) {
  useEffect(() => {
    setTimeout(() => onRemove(id), 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`toast ${data?.type} clickable`}
      onClick={() => onRemove(id)}
      title="click to dismiss"
    >
      <h3>{data?.heading}</h3>
      <p>{data?.body}</p>
    </div>
  );
}

export default Toast;
