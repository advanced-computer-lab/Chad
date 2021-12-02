import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { getSession } from "../Utils/SessionUtils";
import { UserInfoReq } from "../APIs/AuthAPIs";
import ProtectedRotute from "./ProtectedRoute";
import UserContext from "../Context/UserContext";
import PlaceContext from "../Context/PlaceContext";
import CreateFlight from "../Pages/CreateFlight";
import AppBar from "./AppBar";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Loading from "./Loading";
import EditFlight from "../Pages/EditFlight";
import { getPlaces } from "../APIs/PlaceAPI";

function App() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // this is to load the user info between the sessions `reloadings`
    (async () => {
      try {
        if (getSession()) {
          let res = await UserInfoReq();

          // TODO show err msg
          if (res.status !== 200) return;

          let jsonData = await res.json();

          // TODO show msg
          if (!jsonData.success) return;

          setUserData(jsonData.user);
        }
      } catch (err) {
        // TODO handle error
      }

      setLoading(false);
    })();
  }, []);

  // get the places from the API
  useEffect(() => {
    (async () => {
      try {
        const result = await getPlaces();
        if (result.status !== 200) {
          // TODO handle the err;
        }
        const data = await result.json();
        setPlaces(data.places);
      } catch (err) {
        // TODO handle the err;
      }
    })();
  }, []);

  return (
    <PlaceContext.Provider value={{ places }}>
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
              <ProtectedRotute path="/edit-flight">
                <EditFlight />
              </ProtectedRotute>
            </Switch>
          </>
        )}
      </UserContext.Provider>
    </PlaceContext.Provider>
  );
}

export default App;
