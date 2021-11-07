import Flight from "./Flight";
import "../Styles/Components/FlightList.scss";

function FlightList({ flights }) {
  return (
    <div className="flight-list">
      {flights.map((f, i) => (
        <Flight data={f} key={i} />
      ))}
    </div>
  );
}

export default FlightList;
