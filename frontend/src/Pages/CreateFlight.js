import { useState } from "react";
import ClassInfo from "../Components/ClassInfo";
import { addFlight } from "../APIs/FlightAPI";

function CreateFlight() {
  const [flightNumber, setFlightNumber] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [classInfo, setClassInfo] = useState([]);

  const handleAddFLight = async (event) => {
    event.preventDefault();
    let res = await addFlight({
      flightNumber,
      departure,
      arrival,
      departureLocation,
      arrivalLocation,
      numberOfSeats,
      classInfo,
      // TODO get user id from the context
      creatorId: "61858cd499acf828eff75cac",
    });

    // TODO display error msg
    if (res.status !== 200) return;

    let data = await res.json();
    console.log(data);
  };

  return (
    <div className="page" onSubmit={handleAddFLight}>
      <form className="create-flight-form">
        <input
          className="create-flight-form__flight-number"
          type="text"
          value={flightNumber}
          onChange={({ target }) => setFlightNumber(target.value)}
          maxLength="10"
          pattern="\w+"
          required
        />
        <input
          className="create-flight-form__departure"
          type="datetime-local"
          value={departure}
          onChange={({ target }) => setDeparture(target.value)}
          required
        />
        <input
          className="create-flight-form__arrival"
          type="datetime-local"
          value={arrival}
          onChange={({ target }) => setArrival(target.value)}
          required
        ></input>
        <input
          className="create-flight-form__noSeats"
          type="number"
          value={numberOfSeats}
          onChange={({ target }) => setNumberOfSeats(target.value)}
          required
        />
        <input
          className="create-flight-form__departure-loc"
          type="text"
          value={departureLocation}
          onChange={({ target }) => setDepartureLocation(target.value)}
          maxLength="25"
          pattern="\w+"
          required
        />
        <input
          className="create-flight-form__arrival-loc"
          type="text"
          value={arrivalLocation}
          onChange={({ target }) => setArrivalLocation(target.value)}
          maxLength="25"
          pattern="\w+"
          required
        />
        <ClassInfo data={classInfo} onChange={setClassInfo} />
        <button type="submit" className="create-flight-form__submit">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateFlight;
