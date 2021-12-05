import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { getSession } from "../Utils/SessionUtils";
import { UserInfoReq } from "../APIs/AuthAPIs";
import { getPlaces } from "../APIs/PlaceAPI";
import { loadFromLS } from "../Utils/storageUtils";
import UserContext from "../Context/UserContext";
import SelectedFlightContext from "../Context/SelectedFlight";
import SelectedFlights from "../Context/SelectedFlights";
import PlaceContext from "../Context/PlaceContext";
import ToastContext from "../Context/ToastContext";
import CreateFlight from "../Pages/CreateFlight";
import ProtectedRotute from "./ProtectedRoute";
import SelectBag from "./SelectBag";
import AppBar from "./AppBar";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Loading from "./Loading";
import SelectFLightInfo from "./SelectFlightInfo";
import EditFlight from "../Pages/EditFlight";
import ToastList from "./ToastList";
import "../Styles/Components/Overlay.scss";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Pages/Profile";

function App() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [showOverlay, setShowOverylay] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // this is to load the user info between the sessions `reloadings`
    (async () => {
      try {
        if (getSession()) {
          let res = await UserInfoReq();

          if (res.status !== 200) {
            addToasts({
              type: "danger",
              body: "network error or invalid token",
            });
            return;
          }
          let jsonData = await res.json();

          if (!jsonData.success) {
            addToasts({
              type: "danger",
              body: "invalid token",
            });
            return;
          }

          setUserData(jsonData.user);
          addToasts({
            type: "success",
            body: "logged in !",
          });
        }
      } catch (err) {
        addToasts({
          type: "danger",
          body: "unexpected error",
        });
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
          addToasts({
            type: "danger",
            body: "network error",
          });
        }
        const data = await result.json();
        setPlaces(data.places);
      } catch (err) {
        addToasts({
          type: "danger",
          body: "unexpected error",
        });
      }
    })();
  }, []);

  useEffect(() => {
    let savedData = loadFromLS("FLIGHTSTOBOOK", selectedFlights);
    if (savedData && Array.isArray(savedData)) {
      setSelectedFlights(savedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSelectFlightPopUp = () => {
    setShowOverylay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverylay(false);
    setSelectedFlight(null);
  };

  const addToasts = (data) => {
    setToasts((prev) => [...prev, { id: (prev.at(-1) || 0) + 1, ...data }]);
  };

  return (
    <ToastContext.Provider value={{ toasts, setToasts, addToasts }}>
      <SelectedFlightContext.Provider
        value={{ selectedFlight, setSelectedFlight, showSelectFlightPopUp }}
      >
        <PlaceContext.Provider value={{ places }}>
          <SelectedFlights.Provider
            value={{
              selectedFlights,
              setSelectedFlights,
            }}
          >
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
                      <SelectBag />
                    </Route>
                    <Route path="/login">
                      <Login />
                    </Route>
                    <Route path="/register">
                      <Register />
                    </Route>
                    <ProtectedRoute path="/profile">
                      <Profile />
                    </ProtectedRoute>
                    <ProtectedRotute path="/create-flight">
                      <CreateFlight />
                    </ProtectedRotute>
                    <ProtectedRotute path="/edit-flight">
                      <EditFlight />
                    </ProtectedRotute>
                  </Switch>
                </>
              )}
              <div
                className={`overlay ${showOverlay ? "overlay__show" : ""}`}
                onClick={handleCloseOverlay}
              />
              {showOverlay && (
                <SelectFLightInfo show={true} onClose={handleCloseOverlay} />
              )}
              <ToastList />
            </UserContext.Provider>
          </SelectedFlights.Provider>
        </PlaceContext.Provider>
      </SelectedFlightContext.Provider>
    </ToastContext.Provider>
  );
}

export default App;
