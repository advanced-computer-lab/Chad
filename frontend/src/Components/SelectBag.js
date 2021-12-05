import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { saveToLS, removeFromLS } from "../Utils/storageUtils.js";
import Flight from "./Flight";
import SelectedFlights from "../Context/SelectedFlights";
import UserContext from "../Context/UserContext";
import "../Styles/Components/SelectBag.scss";

function SelectBag() {
  const { selectedFlights, setSelectedFlights } = useContext(SelectedFlights);
  const { userData } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const isAuth = userData && Object.keys(userData).length;
  const history = useHistory();

  const handelShow = () => {
    setShow((prev) => !prev);
  };
  const handelRemove = (flightNumber) => {
    setSelectedFlights((prev) =>
      prev.filter((f) => f.flightNumber !== flightNumber)
    );
    if (selectedFlights.length === 1) setShow(false);
    removeFromLS("FLIGHTSTOBOOK");
  };
  const handelBook = () => {
    //TODO post tickets to backend
  };
  const handelLoginRedirect = () => {
    saveToLS("FLIGHTSTOBOOK", selectedFlights);
    history.push("/login");
  };

  return (
    <>
      <div
        className={`selected-bag__overlay ${show ? "show-overlay" : ""}`}
        onClick={handelShow}
      ></div>
      <div className={`select-bag ${show ? "show-bag" : ""}`}>
        <div className="row">
          {selectedFlights.map((f, i) => (
            <Flight
              key={i}
              data={f}
              editable={false}
              showX={true}
              choosen={true}
              onRemove={handelRemove}
            />
          ))}
        </div>
        {selectedFlights.length ? (
          <button className="show clickable" onClick={handelShow}>
            {selectedFlights.length}
          </button>
        ) : (
          ""
        )}
        {show && (
          <div className="row book-div">
            {isAuth ? (
              <button className="clickable book-btn" onClick={handelBook}>
                Book
              </button>
            ) : (
              <button
                className="clickable book-btn"
                onClick={handelLoginRedirect}
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SelectBag;
