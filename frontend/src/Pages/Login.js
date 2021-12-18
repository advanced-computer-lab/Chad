import { useContext, useState } from "react";
import { loginReq } from "../APIs/AuthAPIs";
import { saveSession } from "../Utils/SessionUtils";
import { useHistory } from "react-router";
import UserContext from "../Context/UserContext";
import ToastContext from "../Context/ToastContext";
import Journey from "../Assets/journey.svg";
import "../Styles/Components/Login.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useContext(UserContext);
  const { addToasts } = useContext(ToastContext);

  const history = useHistory();

  const isValid = email && password;

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let res = await loginReq({
        email,
        password,
      });

      if (res.status !== 200) {
        addToasts({
          body: "invalid usermail or password",
          type: "danger",
        });
        return;
      }

      let jsonData = await res.json();

      if (!jsonData.success) {
        addToasts({
          body: "invalid usermail or password",
          type: "danger",
        });
        return;
      }

      addToasts({
        body: "login successfull",
        type: "success",
      });

      // save the token to the session
      saveSession(jsonData.token);

      // update the user data in the context
      setUserData(jsonData.user);

      // redirect to home
      history.push("/");
    } catch (err) {
      addToasts({
        body: "unexpected error",
        type: "danger",
      });
    }
  };

  return (
    <div className="page login">
      <img src={Journey} alt="logo" />
      <form className="login-form" onSubmit={onSubmit}>
        <div className="login-form__content">
          <h2 className="login-form__h2">Login</h2>
          <div className="login-form__body-wrap">
            <div className="login-form__input-wrap">
              <label htmlFor="email" className="login-form__lable">
                Email
              </label>
              <input
                className="login-form__input"
                id="email"
                name="email"
                value={email}
                type="text"
                onChange={({ target }) => setEmail(target.value)}
                required
              />
            </div>
            <div className="login-form__input-wrap">
              <label htmlFor="password">Password</label>
              <input
                className="login-form__input"
                name="password"
                id="password"
                value={password}
                type="password"
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </div>
          </div>
          <div
            className="row"
            style={{ marginBottom: "50px", marginTop: "auto" }}
          >
            <button
              className="clickable login-form__btn"
              type="submit"
              disabled={!isValid}
            >
              Login
            </button>
            <button
              className="clickable login-form__btn"
              onClick={() => history.push("/register")}
            >
              Rgister
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
