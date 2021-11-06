import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { getSession } from "../Utils/SessionUtils";
import { UserInfoReq } from "../APIs/AuthAPIs";
import ProtectedRotute from "./ProtectedRoute";
import UserContext from "../Context/UserContext";
import CreateFlight from "../Pages/CreateFlight";
import AppBar from "./AppBar";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Loading from "./Loading";

function App() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
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
            <ProtectedRotute path="/create-flight">
              <CreateFlight />
            </ProtectedRotute>
          </Switch>
        </>
      )}
    </UserContext.Provider>
  );
}

export default App;
