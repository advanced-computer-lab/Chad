import { useContext, useState } from "react";
import { loginReq } from "../APIs/AuthAPIs";
import { saveSession } from "../Utils/SessionUtils";
import UserContext from "../Context/UserContext";
import { useHistory } from "react-router";
import "../Styles/Components/Login.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const isValid = email && password;

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let res = await loginReq({
        email,
        password,
      });

      // TODO display err msg
      if (res.status !== 200) return;

      let jsonData = await res.json();

      // TODO display msg
      if (!jsonData.success) return;

      // save the token to the session
      saveSession(jsonData.token);

      // update the user data in the context
      setUserData(jsonData.user);

      // redirect to home
      history.push("/");
    } catch (err) {
      // TODO hanle errors and show msgs
    }
  };

  return (
    <div className="page">
      <form className="login-form" onSubmit={onSubmit}>
        <div className="login-form__content">
          <h2 className="login-form__h2">Login</h2>
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
          <div className="row">
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
