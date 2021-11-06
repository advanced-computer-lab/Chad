import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../Context/UserContext";
import "../Styles/Components/AppBar.scss";

function AppBar() {
  const location = useLocation();
  const { userData } = useContext(UserContext);

  return (
    <div className="app-bar">
      <h2 className="app-bar__logo logo">LOGO</h2>
      <div className="app-bar__nav">
        {!location.pathname.includes("login") && !userData?._id && (
          <Link to="/login" className="link_btn app-bar__btn clickable">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
export default AppBar;
