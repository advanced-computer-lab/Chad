import Flight from "./Flight";
import "../Styles/Components/FlightList.scss";
import { useState } from "react";

function FlightList({ flights }) {
  const [, update] = useState(true);

  const handleDelete = (i) => {
    flights.splice(i, 1);
    update();
  };

  return (
    <div className="flight-list">
      {flights.map((f, i) => (
        <Flight data={f} key={i} idx={i} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default FlightList;
