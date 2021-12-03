import { useContext, useState } from "react";
import SelectedFlights from "../Context/SelectedFlights";
import Flight from "./Flight";
import "../Styles/Components/SelectBag.scss";

function SelectBag() {
  const { selectedFlights } = useContext(SelectedFlights);
  const [show, setShow] = useState(false);

  const handelShow = () => {
    setShow((prev) => !prev);
  };
  const handelRemove = () => {};
  const handelBook = () => {};

  return (
    <>
      <div
        className={`selected-bag__overlay ${show ? "show-overlay" : ""}`}
        onClick={handelShow}
      ></div>
      <div className={`select-bag ${show ? "show-bag" : ""}`}>
        <div className="row">
          {selectedFlights.map((f, i) => (
            <Flight
              key={i}
              data={f}
              editable={false}
              showX={true}
              onRemove={handelRemove}
            />
          ))}
        </div>
        {selectedFlights.length ? (
          <button className="show clickable" onClick={handelShow}>
            {selectedFlights.length}
          </button>
        ) : (
          ""
        )}
        {show && (
          <div className="row book-div">
            <button className="clickable book-btn" nClick={handelBook}>
              Book
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SelectBag;
