import { Switch, Route } from "react-router-dom";
import UserContext from "../Context/UserContext";
import AppBar from "./AppBar";
import Home from "../Pages/Home";
import { useState } from "react";

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
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
