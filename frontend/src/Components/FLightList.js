import { useState, useEffect, useContext } from "react";
import Flight from "./Flight";
import SelectedFlights from "../Context/SelectedFlights";
import "../Styles/Components/FlightList.scss";

function FlightList({ flights }) {
  const [, update] = useState(true);
  const { selectedFlights, setSelectedFlights } = useContext(SelectedFlights);
  const [flightsSet, setFlightsSet] = useState(new Set());

  useEffect(() => {
    for (let { flightNumber } of selectedFlights) flightsSet.add(flightNumber);
    setFlightsSet(new Set(flightsSet));
  }, [selectedFlights]);

  const handleDelete = (i) => {
    flights.splice(i, 1);
    update();
  };

  const handleOnSelect = (data) => {
    if (flightsSet.has(data.flightNumber)) {
      setSelectedFlights((prevState) =>
        prevState.filter((f) => f.flightNumber !== data.flightNumber)
      );
      flightsSet.delete(data.flightNumber);
    } else {
      if (selectedFlights?.length === 2) return;
      setSelectedFlights((prevState) => [...prevState, data]);
    }
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
