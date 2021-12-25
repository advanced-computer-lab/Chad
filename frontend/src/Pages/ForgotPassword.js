import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { sendTmpPassword } from "../APIs/ForgotAPI";
import Loading from "../Components/Loading";
import ToastContext from "../Context/ToastContext";
import find from "../Assets/find-fp.svg";
import "../Styles/Components/ForgotPassword.scss";

function ForgotPassword() {
  const [animateClass, setAnimateClass] = useState("animate");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToasts } = useContext(ToastContext);
  const history = useHistory();

  useEffect(() => {
    let id = setTimeout(() => setAnimateClass(""), 1000);
    return () => clearTimeout(id);
  }, []);

  const isValid = !!email;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      let res = await sendTmpPassword(email);

      if (res.status !== 200) {
        setLoading(false);
        addToasts({
          body: "cannot send mail",
          type: "danger",
        });
        return;
      }
      setLoading(false);
      history.push("/login");
      addToasts({
        body: "mail send successfully",
        type: "success",
      });
    } catch (err) {
      setLoading(false);
      addToasts({
        body: "unexpected error",
        type: "danger",
      });
    }
  };

  return (
    <div className={`page forgot ${animateClass}`}>
      <img src={find} alt="find user" />
      <form className="forgot-form" onSubmit={handleSubmit}>
        {loading && <Loading />}
        <div className="forgot-form__content">
          <h2 className="forgot-form__h2">Send temporary password</h2>
          <div className="wrap">
            <div className="forgot-form__wrap">
              <label htmlFor="name" className="forgot-form__label">
                Email
              </label>
              <input
                className="forgot-form__input"
                name="email"
                id="email"
                value={email}
                type="test"
                onChange={({ target }) => setEmail(target.value)}
                required
              />
            </div>
          </div>
          <button
            className="forgot-form__btn clickable"
            type="submit"
            style={{ width: "150px", marginTop: "auto", marginBottom: "50px" }}
            disabled={!isValid}
          >
            send mail
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
