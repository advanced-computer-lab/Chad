import { useContext, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ADMIN } from "../Constants/UserEnums";
import { clearSession } from "../Utils/SessionUtils";
import UserContext from "../Context/UserContext";
import "../Styles/Components/AppBar.scss";

function AppBar() {
  const location = useLocation();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const { userData, setUserData } = useContext(UserContext);

  // some flags for conditional rendering
  const isAuth = !!userData._id;
  const isAdmin = isAuth && userData.role === ADMIN;
  const isCreate = location.pathname.includes("create-flight");
  const isHome = location.pathname === "/";

  const handleLogout = () => {
    setUserData({});
    clearSession();
    history.push("/");
  };

  console.log(location.pathname);
  // hide from login and signup;
  if (
    ["/login", "/register", "/forgot-password"].some(
      (name) => location.pathname === name
    ) ||
    !["/profile", "/", "/edit-flight", "/create-flight"].some(
      (name) => location.pathname === name
    )
  )
    return null;

  return (
    <div className="app-bar">
      <h2 className="app-bar__logo logo">
        <Link to="/" className="link_btn">
          CHAD
        </Link>
      </h2>
      <div style={{ display: "flex" }}>
        <div className="app-bar__nav">
          {isAdmin ? (
            <Link
              to="/create-flight"
              className={`link_btn app-bar__btn clickable ${
                isCreate ? "active" : ""
              }`}
            >
              Create Fight
            </Link>
          ) : (
            !isAuth && (
              <Link to="/login" className="link_btn app-bar__btn clickable">
                Login
              </Link>
            )
          )}
          <Link
            to="/"
            className={`link_btn app-bar__btn clickable ${
              isHome ? "active" : ""
            }`}
          >
            Home
          </Link>
        </div>
        {isAuth && (
          <div className="app-bar__profile">
            <button
              className="profile-btn clickable"
              title="profile"
              onClick={() => setVisible((prev) => !prev)}
            />
            <div
              className={`menu-list ${visible ? "active" : ""}`}
              onClick={() => setVisible(false)}
            >
              <Link to="/profile">profile</Link>
              <button className="clickable" onClick={handleLogout}>
                logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AppBar;
