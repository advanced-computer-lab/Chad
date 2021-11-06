import { useContext } from "react";
import { Redirect, Route } from "react-router";
import UserContext from "../Context/UserContext";

function ProtectedRoute({ children, ...args }) {
  const redirectLink = "/login";
  const { userData } = useContext(UserContext);

  const isAuth = userData && Object.keys(userData).length;

  return (
    <Route {...args}>
      {isAuth ? children : <Redirect to={redirectLink} />}
    </Route>
  );
}

export default ProtectedRoute;
