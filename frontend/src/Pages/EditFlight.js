import { useContext, useLayoutEffect, useState } from "react";
import { updateFlight } from "../APIs/FlightAPI";
import { useHistory } from "react-router";
import { ADMIN } from "../Constants/UserEnums";
import ClassInfo from "../Components/ClassInfo";
import UserContext from "../Context/UserContext";
import PlaceContext from "../Context/PlaceContext";
import "../Styles/Components/CreateFlight.scss";
import { useLocation } from "react-router";

function EditFlight() {
  const {
    state: { flight },
  } = useLocation();
  const history = useHistory();
  const { userData } = useContext(UserContext);

  const [flightNumber, setFlightNumber] = useState(flight?.flightNumber);
  const [departure, setDeparture] = useState(flight?.departure);
  const [arrival, setArrival] = useState(flight?.arrival);
  const [numberOfSeats, setNumberOfSeats] = useState(flight?.numberOfSeats);
  const [departureLocation, setDepartureLocation] = useState(
    flight?.departureLocation
  );
  const [arrivalLocation, setArrivalLocation] = useState(
    flight?.arrivalLocation
  );
  const [classInfo, setClassInfo] = useState(flight?.classInfo);
  const { places } = useContext(PlaceContext);

  const isValid =
    flightNumber &&
    departure &&
    arrival &&
    numberOfSeats &&
    departureLocation &&
    arrivalLocation &&
    classInfo;

  const clearFields = () => {
    [
      setFlightNumber,
      setArrival,
      setDeparture,
      setDepartureLocation,
      setArrivalLocation,
      setNumberOfSeats,
    ].forEach((f) => f(""));

    setClassInfo([]);
  };

  const handleEditFLight = async (event) => {
    event.preventDefault();

    try {
      let res = await updateFlight(flight._id, {
        departure,
        arrival,
        departureLocation,
        arrivalLocation,
        numberOfSeats,
        classInfo,
        flightNumber,
      });

      // TODO display error msg
      if (res.status !== 200) return;

      await res.json();

      clearFields();
    } catch (err) {
      // TODO handle err and show msgs
    }
  };

  // check befor rendering that the user is admin
  useLayoutEffect(() => {
    if (userData.role !== ADMIN) history.push("/");
  });

  return (
    <div className="page" onSubmit={handleEditFLight}>
      <form className="create-flight-form">
        <div className="create-flight-form__content">
          <h2 className="create-flight-form__h2">Edit Flight</h2>
          <div className="create-flight-form__wrap">
            <label htmlFor="fn" className="create-flight-form__label">
              Flight Number
            </label>
            <input
              className="create-flight-form__input"
              type="text"
              id="fn"
              value={flightNumber}
              onChange={({ target }) => setFlightNumber(target.value)}
              maxLength="10"
              pattern="\w+"
            />
          </div>
          <div className="row">
            <div className="create-flight-form__wrap">
              <label htmlFor="dt" className="create-flight-form__label">
                Departure Time
              </label>
              <input
                className="create-flight-form__input"
                id="dt"
                type="datetime-local"
                value={departure.replace("Z", "")}
                onChange={({ target }) => setDeparture(target.value)}
                required
              />
            </div>
            <div className="create-flight-form__wrap">
              <label htmlFor="at" className="create-flight-form__label">
                Arrival Time
              </label>
              <input
                className="create-flight-form__input"
                id="at"
                type="datetime-local"
                value={arrival.replace("Z", "")}
                onChange={({ target }) => setArrival(target.value)}
                required
              />
            </div>
          </div>
          <div className="create-flight-form__wrap">
            <label htmlFor="nos" className="create-flight-form__label">
              Number Of Seats
            </label>
            <input
              className="create-flight-form__input"
              type="number"
              id="nos"
              value={numberOfSeats}
              onChange={({ target }) => setNumberOfSeats(target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="create-flight-form__wrap">
              <label htmlFor="dl" className="create-flight-form__label">
                Departure Location
              </label>
              <select
                className="create-flight-form__input"
                type="text"
                id="dl"
                value={departureLocation}
                onChange={({ target }) => setDepartureLocation(target.value)}
                maxLength="25"
                pattern="\w+"
                required
              >
                {places.map(({ _id, name }, i) => (
                  <option value={_id} key={`place-${i}`}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-flight-form__wrap">
              <label htmlFor="al" className="create-flight-form__label">
                Arrival Location
              </label>
              <select
                className="create-flight-form__input"
                type="text"
                id="al"
                value={arrivalLocation}
                onChange={({ target }) => setArrivalLocation(target.value)}
                maxLength="25"
                pattern="\w+"
                required
              >
                {places.map(({ _id, name }, i) => (
                  <option value={_id} key={`place-${i}`}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h4>Add Classes Info</h4>
          <ClassInfo data={classInfo} onChange={setClassInfo} />
          <button
            type="submit"
            className="create-flight-form__btn"
            disabled={!isValid}
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFlight;
