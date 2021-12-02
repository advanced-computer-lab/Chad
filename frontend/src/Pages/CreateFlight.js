import { useContext, useLayoutEffect, useState } from "react";
import { addFlight } from "../APIs/FlightAPI";
import { useHistory } from "react-router";
import { ADMIN } from "../Constants/UserEnums";
import { TYPES } from "../Constants/ClassEnums";
import ClassInfo from "../Components/ClassInfo";
import UserContext from "../Context/UserContext";
import PlaceContext from "../Context/PlaceContext";
import "../Styles/Components/CreateFlight.scss";

function CreateFlight() {
  const [flightNumber, setFlightNumber] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [priceOfExtraWeight, setPriceOfExtraWeight] = useState(0);
  const [classInfo, setClassInfo] = useState([
    {
      Type: TYPES[0],
      start: 1,
      end: 1,
      priceForAdult: 1,
      priceForChild: 1,
      baggageAllowanceForAdult: 1,
      baggageAllowanceForChild: 1,
      childrenLimit: 1,
    },
  ]);
  const { places } = useContext(PlaceContext);

  const history = useHistory();
  const { userData } = useContext(UserContext);

  const isValid =
    flightNumber &&
    departure &&
    arrival &&
    numberOfSeats &&
    departureLocation &&
    priceOfExtraWeight &&
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
      priceOfExtraWeight,
    ].forEach((f) => f(""));

    setClassInfo([
      {
        Type: TYPES[0],
        start: 1,
        end: 1,
        priceForAdult: 1,
        priceForChild: 1,
        baggageAllowanceForAdult: 1,
        baggageAllowanceForChild: 1,
        childrenLimit: 1,
      },
    ]);
  };

  const handleAddFLight = async (event) => {
    event.preventDefault();

    try {
      let flight = {
        flightNumber,
        departure,
        arrival,
        departureLocation,
        arrivalLocation,
        numberOfSeats,
        classInfo,
        PriceOfExtraWeight: priceOfExtraWeight,
        creatorId: userData._id,
      };
      // add availabel seats in for each class
      for (let i = 0; i < flight.classInfo.length; i++) {
        const { start, end, childrenLimit } = flight.classInfo[i];
        // add the availablenifo to the object
        flight.classInfo[i].availabelChildrenSeats = childrenLimit;
        flight.classInfo[i].availabelAdultsSeats = end - start + 1;
      }
      // console.log(flight);
      // return 0;
      let res = await addFlight(flight);

      // TODO display error msg
      if (res.status !== 200) {
        console.log(await res.json());
        return;
      }

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
    <div className="page" onSubmit={handleAddFLight}>
      <form className="create-flight-form">
        <div className="create-flight-form__content">
          <h2 className="create-flight-form__h2">Add Flight</h2>
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
              pattern="(\w|-)+"
              required
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
                value={departure}
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
                value={arrival}
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
              min="1"
              onChange={({ target }) => setNumberOfSeats(target.value)}
              required
            />
          </div>
          <div className="create-flight-form__wrap">
            <label htmlFor="poew" className="create-flight-form__label">
              Price of Extra Weight
            </label>
            <input
              className="create-flight-form__input"
              type="number"
              id="poew"
              min="0"
              value={priceOfExtraWeight}
              onChange={({ target }) => setPriceOfExtraWeight(target.value)}
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
                <option value="" disabled hidden>
                  Choose Your location
                </option>
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
                <option value="" disabled hidden>
                  Choose Your Destination
                </option>
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateFlight;
