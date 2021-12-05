import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { deleteFlight } from "../APIs/FlightAPI";
import { ADMIN } from "../Constants/UserEnums";
import ToastContext from "../Context/ToastContext";
import UserContext from "../Context/UserContext";
import "../Styles/Components/Flight.scss";

function Flight({
  data,
  onDelete,
  onSelect,
  idx,
  selected,
  editable,
  showX,
  onRemove,
  choosen,
}) {
  const { userData } = useContext(UserContext);
  const { addToasts } = useContext(ToastContext);
  const history = useHistory();

  const handleDeleteFlight = async () => {
    if (!window.confirm("are you sure ?")) return;
    try {
      let res = await deleteFlight(data._id);
      if (res.status !== 200) {
        addToasts({
          type: "danger",
          body: "error deleting flight",
        });
        return;
      }

      onDelete && onDelete(idx);
      addToasts({
        type: "success",
        body: "deleted successfully",
      });
    } catch (err) {
      addToasts({
        type: "danger",
        body: "unexpected error",
      });
    }
  };

  const handleEditFlight = () => {
    history.push({
      pathname: "/edit-flight",
      state: { flight: data },
    });
  };

  const addToSelected = () => {
    userData.role !== ADMIN && onSelect && onSelect(data);
  };

  return (
    <div
      className={`flight ${userData.role === ADMIN ? "" : "clickable"} ${
        selected ? "selected" : ""
      }`}
      onClick={addToSelected}
    >
      {editable && userData.role === ADMIN && (
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
        <p> From: {data.departureLocation.name}</p>
        <p>To: {data.arrivalLocation.name}</p>
      </div>
      <div className="dates">
        <p>{new Date(data.departure).toLocaleString("en-US")}</p>
        <p>{new Date(data.arrival).toLocaleString("en-US")}</p>
      </div>
      {choosen && (
        <>
          <div className="row">
            {data.numberOfChild ? (
              <p style={{ marginLeft: "10px" }}>{data.numberOfChild} child</p>
            ) : null}
            {data.numberOfAdult && <p>{data.numberOfAdult} Adult</p>}
          </div>
          <div>
            <p>Seats</p>
            <div className="row" style={{ flexWrap: "wrap" }}>
              {data.selectedSeats.map((sn, i) => (
                <div className="seat" key={i}>
                  {sn}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div style={{ marginTop: "auto" }}>
        {!choosen &&
          data.classInfo.map((info, i) => (
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
      {showX && (
        <button
          className="remove__btn"
          onClick={() => onRemove(data.flightNumber)}
        >
          x
        </button>
      )}
    </div>
  );
}

export default Flight;
