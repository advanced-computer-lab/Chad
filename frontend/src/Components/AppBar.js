import { useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ADMIN } from "../Constants/UserEnums";
import UserContext from "../Context/UserContext";
import "../Styles/Components/AppBar.scss";
import { clearSession } from "../Utils/SessionUtils";

function AppBar() {
  const location = useLocation();
  const history = useHistory();
  const { userData, setUserData } = useContext(UserContext);

  const handleLogout = () => {
    setUserData({});
    clearSession();
    history.push("/");
  };

  return (
    <div className="app-bar">
      <h2 className="app-bar__logo logo">
        <Link to="/" className="link_btn">
          LOGO
        </Link>
      </h2>
      <div className="app-bar__nav">
        {!location.pathname.includes("login") &&
          (userData._id ? (
            <>
              <button
                className="link_btn app-bar__btn clickable"
                onClick={handleLogout}
              >
                Logout
              </button>
              {userData.role === ADMIN &&
                !location.pathname.includes("create-flight") && (
                  <Link
                    to="/create-flight"
                    className="link_btn app-bar__btn clickable"
                  >
                    Create Fight
                  </Link>
                )}
            </>
          ) : (
            <Link to="/login" className="link_btn app-bar__btn clickable">
              Login
            </Link>
          ))}
        <Link to="/" className="link_btn app-bar__btn clickable">
          Home
        </Link>
      </div>
    </div>
  );
}
export default AppBar;
