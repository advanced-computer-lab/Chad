import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { getSession } from "../Utils/SessionUtils";
import { UserInfoReq } from "../APIs/AuthAPIs";
import UserContext from "../Context/UserContext";
import AppBar from "./AppBar";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

function App() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // this is to load the user info between the sessions `reloadings`
    (async () => {
      if (getSession()) {
        let res = await UserInfoReq();

        // TODO show err msg
        if (res.status !== 200) return;

        let jsonData = await res.json();

        // TODO show msg
        if (!jsonData.success) return;

        setUserData(jsonData.user);
      }
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      <AppBar />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
