import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { deleteFlight } from "../APIs/FlightAPI";
import UserContext from "../Context/UserContext";

function Flight({ data }) {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const handleDeleteFlight = async () => {
    try {
      await deleteFlight(data._id);
    } catch (err) {
      // TODO
    }
  };

  const handleEditFlight = () => {
    history.push({
      pathname: "/edit-flight",
      state: { flight: data },
    });
  };

  return (
    <div className="flight">
      {userData._id && (
        <div className="edit-delete">
          <button className="clickable" onClick={handleDeleteFlight}>
            delete
          </button>
          <button className="clickable" onClick={handleEditFlight}>
            edit
          </button>
        </div>
      )}
      <h3>{data.flightNumber}</h3>
      <div className="row location">
        <p> From: {data.departureLocation}</p>
        <p>To: {data.arrivalLocation}</p>
      </div>
      <div className="dates">
        <p>{new Date(data.departure).toLocaleString("en-US")}</p>
        <p>{new Date(data.arrival).toLocaleString("en-US")}</p>
      </div>
      <div style={{ marginTop: "auto" }}>
        {data.classInfo.map((info, i) => (
          <div className="row" key={i}>
            <p>
              <strong>{info.Type}</strong>
            </p>
            <div className="row" style={{ marginLeft: "auto" }}>
              <p>{info.start}</p>
              <p>{info.end}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flight;
