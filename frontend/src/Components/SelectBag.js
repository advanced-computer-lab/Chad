import { useContext, useState } from "react";
import SelectedFlights from "../Context/SelectedFlights";
import Flight from "./Flight";
import "../Styles/Components/SelectBag.scss";

function SelectBag() {
  const { selectedFlights } = useContext(SelectedFlights);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <div
        className={`selected-bag__overlay ${show ? "show-overlay" : ""}`}
        onClick={handleShow}
      ></div>
      <div className={`select-bag ${show ? "show-bag" : ""}`}>
        {selectedFlights.map((f, i) => (
          <Flight key={i} data={f} editable={false} />
        ))}
        {selectedFlights.length ? (
          <button className="show clickable" onClick={handleShow}>
            {selectedFlights.length}
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default SelectBag;
