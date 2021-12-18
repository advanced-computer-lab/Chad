import { useState, useContext } from "react";
import { useHistory } from "react-router";
import { registerReq } from "../APIs/AuthAPIs";
import ToastContext from "../Context/ToastContext";
import airport from "../Assets/airport.svg";
import "../Styles/Components/Register.scss";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");

  const { addToasts } = useContext(ToastContext);

  const history = useHistory();

  const isValid = name && email && password && age && mobile;

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let res = await registerReq({
        name,
        email,
        password,
        age,
        mobile,
      });

      const data = await res.json();
      if (res.status !== 200 || !data.success) {
        addToasts({
          body: "cannot create user please change the email",
          type: "danger",
        });
        return;
      }

      // redirect to login
      history.push("/login");
    } catch (err) {
      addToasts({
        body: "unexpected error",
        type: "danger",
      });
    }
  };

  return (
    <div className="page register">
      <img src={airport} alt="airport" />
      <form className="reg-form" onSubmit={onSubmit}>
        <div className="reg-form__content">
          <h2 className="reg-form__h2">Register as new User</h2>
          <div className="wrap">
            <div className="reg-form__wrap">
              <label htmlFor="name" className="reg-form__label">
                Name
              </label>
              <input
                className="reg-form__input"
                name="name"
                id="name"
                value={name}
                type="text"
                onChange={({ target }) => setName(target.value)}
                required
              />
            </div>
            <div className="reg-form__wrap">
              <label htmlFor="email" className="reg-form__label">
                Email
              </label>
              <input
                className="reg-form__input"
                id="email"
                name="email"
                value={email}
                type="email"
                onChange={({ target }) => setEmail(target.value)}
                required
              />
            </div>
            <div className="reg-form__wrap">
              <label htmlFor="password" className="reg-form__label">
                Password
              </label>
              <input
                className="reg-form__input"
                name="password"
                id="password"
                value={password}
                type="password"
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </div>
            <div className="reg-form__wrap">
              <label htmlFor="age" className="reg-form__label">
                Age
              </label>
              <input
                className="reg-form__input"
                name="age"
                id="age"
                value={age}
                type="number"
                onChange={({ target }) => setAge(target.value)}
                required
              />
            </div>
            <div className="reg-form__wrap">
              <label htmlFor="mobile" className="reg-form__label">
                Mobile
              </label>
              <input
                className="reg-form__input"
                name="mobile"
                id="mobile"
                value={mobile}
                type="text"
                onChange={({ target }) => setMobile(target.value)}
                required
              />
            </div>
          </div>
          <button
            className="reg-form__btn clickable"
            type="submit"
            style={{ width: "150px", marginTop: "auto", marginBottom: "50px" }}
            disabled={!isValid}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
