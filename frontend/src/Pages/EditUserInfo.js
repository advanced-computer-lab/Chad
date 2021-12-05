import { updateUser, getUser } from "../APIs/UserAPI";
import "../Styles/Components/CreateFlight.scss";

function EditUserInfo() {
  let user = getUser();
  console.log(user);

  const [name, setName] = user.name;
  const [password, setPassword] = user.password;
  const [email, setEmail] = user.email;
  const [phone, setPhone] = user.phone;

  const isValid = name && password && email && phone;

  const clearFields = () => {
    [setName, setPassword, setEmail, setPhone].forEach((f) => f(""));
  };
  const handleEditUserInfo = async (event) => {
    event.preventDefault();

    try {
      let newData = {
        name,
        password,
        email,
        phone,
      };
      // console.log(newData);
      // return 0;
      let res = await updateUser(newData);

      // TODO display error msg
      if (res.status !== 200) return;

      await res.json();

      clearFields();
    } catch (err) {
      // TODO handle err and show msgs
    }
  };

  return (
    <div className="page" onSubmit={handleEditUserInfo}>
      <form className="update-user-form">
        <div className="update-user-form__content">
          <h2 className="update-user-form__h2">Edit User</h2>
          <div className="update-user-form__wrap">
            <label htmlFor="n" className="update-user-form__label">
              Name
            </label>
            <input
              className="update-user-form__input"
              type="text"
              id="n"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div className="row">
            <div className="update-user-form__wrap">
              <label htmlFor="e" className="update-user-form__label">
                Email
              </label>
              <input
                className="update-user-form__input"
                id="e"
                type="text"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
            </div>
            <div className="update-user-form__wrap">
              <label htmlFor="p" className="update-user-form__label">
                Password
              </label>
              <input
                className="update-user-form__input"
                id="p"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
          </div>
          <div className="update-user-form__wrap">
            <label htmlFor="ph" className="update-user-form__label">
              Phone
            </label>
            <input
              className="update-user-form__input"
              type="number"
              id="ph"
              value={phone}
              onChange={({ target }) => setPhone(target.value)}
            />
          </div>
          <button
            type="submit"
            className="update-user-form__btn"
            disabled={!isValid}
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUserInfo;
