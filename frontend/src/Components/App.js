import { Switch, Route } from "react-router-dom";
import { useState } from "react";
import UserContext from "../Context/UserContext";
import AppBar from "./AppBar";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

function App() {
  const [userData, setUserData] = useState({});

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
        <Route>
          <Register />
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
