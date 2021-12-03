import { useState, useEffect, useContext } from "react";
import SelectedFlights from "../Context/SelectedFlights";
import Flight from "./Flight";
import "../Styles/Components/FlightList.scss";
import SelectedFlightContext from "../Context/SelectedFlight";

function FlightList({ flights }) {
  const [, update] = useState(true);
  const [flightsSet, setFlightsSet] = useState(new Set());

  const { selectedFlights } = useContext(SelectedFlights);
  const { setSelectedFlight, showSelectFlightPopUp } = useContext(
    SelectedFlightContext
  );

  useEffect(() => {
    for (let { flightNumber } of selectedFlights) flightsSet.add(flightNumber);
    setFlightsSet(new Set(flightsSet));
  }, [selectedFlights]);

  const handleDelete = (i) => {
    flights.splice(i, 1);
    update();
  };

  const handleOnSelect = (data) => {
    setSelectedFlight(data);
    showSelectFlightPopUp();
  };

  return (
    <div className="flight-list">
      {flights.map((f, i) => (
        <Flight
          data={f}
          key={i}
          idx={i}
          onDelete={handleDelete}
          onSelect={handleOnSelect}
          selected={flightsSet.has(f.flightNumber)}
          editable={true}
        />
      ))}
    </div>
  );
}

export default FlightList;
