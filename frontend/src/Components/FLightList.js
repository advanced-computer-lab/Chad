import { useState, useContext } from "react";
import SelectedFlights from "../Context/SelectedFlights";
import Flight from "./Flight";
import Loading from "./Loading";
import "../Styles/Components/FlightList.scss";
import SelectedFlightContext from "../Context/SelectedFlight";

function FlightList({ flights, loading }) {
  const [, update] = useState(true);

  const { selectedFlights } = useContext(SelectedFlights);
  const { setSelectedFlight, showSelectFlightPopUp } = useContext(
    SelectedFlightContext
  );

  const handleDelete = (i) => {
    flights.splice(i, 1);
    update();
  };

  const handleOnSelect = (data) => {
    setSelectedFlight(data);
    showSelectFlightPopUp();
  };

  return (
    <div
      className="flight-list"
      style={{ position: "relative", minHeight: "305px" }}
    >
      {loading ? (
        <Loading />
      ) : (
        flights.map((f, i) => (
          <Flight
            data={f}
            key={i}
            idx={i}
            onDelete={handleDelete}
            onSelect={handleOnSelect}
            selected={selectedFlights.some(
              (_f) => _f.flightNumber === f.flightNumber
            )}
            editable={true}
          />
        ))
      )}
    </div>
  );
}

export default FlightList;
