import { useContext, useState } from "react";
import { TYPES } from "../Constants/ClassEnums";
import SelectedFlightContext from "../Context/SelectedFlight";
import SelectedFlights from "../Context/SelectedFlights";
import ToastContext from "../Context/ToastContext";
import "../Styles/Components/SelectFlightInfo.scss";

function SelectFLightInfo({ show, onClose }) {
  const { selectedFlight } = useContext(SelectedFlightContext);
  const { selectedFlights, setSelectedFlights } = useContext(SelectedFlights);
  const { addToasts } = useContext(ToastContext);

  const { classInfo } = selectedFlight || { classInfo: "" };
  // console.log(selectedFlight, classInfo, classInfo[0]?.Type);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [classType, setClassType] = useState(classInfo[0]?.Type);
  const [numberOfAdult, setNumberOfAdult] = useState(1);
  const [numberOfChild, setNumberOfChild] = useState(0);

  if (!selectedFlight) return <></>;

  console.log(classInfo);

  const selectSeat = (seatNumber) => {
    if (!selectedSeats.includes(seatNumber)) {
      if (
        selectedSeats.length ===
        Number(numberOfAdult) + Number(numberOfChild)
      )
        return;
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      setSelectedSeats((prev) => prev.filter((sn) => sn !== seatNumber));
    }
  };

  const handleContinue = () => {
    if (
      selectedSeats.length !==
      Number(numberOfAdult) + Number(numberOfChild)
    ) {
      addToasts({
        type: "danger",
        body: "please select the number of passenger correctly",
      });
      return;
    }

    let flightToBook = {
      ...selectedFlight,
      numberOfChild,
      numberOfAdult,
      selectedSeats,
      classType,
    };

    if (
      selectedFlights?.length === 2 &&
      !selectedFlights.some(
        ({ flightNumber }) => flightNumber === flightToBook.flightNumber
      )
    ) {
      // TODO handle not show in the first place
      addToasts({
        type: "danger",
        body: "you can't select more than two flights",
      });
      onClose();
      return;
    }

    console.log(selectedFlights);
    setSelectedFlights([
      ...selectedFlights.filter(
        ({ flightNumber }) => flightNumber !== flightToBook.flightNumber
      ),
      flightToBook,
    ]);
    onClose();
  };

  return (
    <div
      className={`flight-select-popup ${
        show ? "flight-select-popup__show" : ""
      }`}
    >
      <div className="row">
        <div className="input__wrap">
          <label className="input__label" htmlFor="class-type">
            Select a Class
          </label>
          <select
            className="input__select"
            id="class-type"
            value={classType}
            onChange={({ target }) => setClassType(target.value)}
          >
            <option value="" disabled hidden>
              Choose A Class
            </option>
            {TYPES.map((t, i) => (
              <option vlaue={t} key={i}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="info" style={{ display: "inline-block" }}>
          Price For Adult:
          <span>
            {classInfo.find(({ Type }) => Type === classType)?.priceForAdult}
          </span>
          EGP
        </div>
        <div className="info" style={{ display: "inline-block" }}>
          Price For Child:
          <span>
            {classInfo.find(({ Type }) => Type === classType)?.priceForChild}
          </span>
          EGP
        </div>
      </div>
      <div className="row">
        <div className="info" style={{ display: "inline-block" }}>
          Allowance For Adult:
          <span>
            {
              classInfo.find(({ Type }) => Type === classType)
                ?.baggageAllowanceForAdult
            }
          </span>
          KG
        </div>
        <div className="info" style={{ display: "inline-block" }}>
          Allowance For Child:
          <span>
            {
              classInfo.find(({ Type }) => Type === classType)
                ?.baggageAllowanceForChild
            }
          </span>
          KG
        </div>
      </div>
      <div className="row">
        <div className="input__wrap">
          <label className="input__label" htmlFor="num-adult">
            number of Adults
          </label>
          <input
            className="input"
            type="number"
            id="num-adult"
            min="1"
            value={numberOfAdult}
            onChange={({ target }) => setNumberOfAdult(target.value)}
          />
        </div>
        <div className="input__wrap">
          <label className="input__label" htmlFor="num-child">
            number of children
          </label>
          <input
            className="input"
            type="number"
            id="num-child"
            min="0"
            value={numberOfChild}
            onChange={({ target }) => setNumberOfChild(target.value)}
          />
        </div>
      </div>
      <div className="row">
        {classInfo
          .filter(({ Type }) => Type === classType)
          .map(({ start, end, reserverdSeats, Type }, i) => (
            <div className="seats" key={`seats-${i}`}>
              {[...Array(end - start + 1)].map((_, i) => (
                <div
                  key={`${Type}-seat-${i}`}
                  className={`seat seat-${start + i} ${
                    reserverdSeats.includes(start + i) ? "taken" : "free"
                  } ${selectedSeats.includes(start + i) ? "selected" : ""}`}
                  onClick={
                    reserverdSeats.includes(start + i)
                      ? () => {}
                      : () => selectSeat(start + i)
                  }
                >
                  {start + i}
                </div>
              ))}
            </div>
          ))}
      </div>
      <div className="row">
        <button className="continue-btn clickable" onClick={handleContinue}>
          Continue
        </button>
      </div>
      <button className="exit-btn clickable" onClick={() => onClose()}>
        x
      </button>
    </div>
  );
}

export default SelectFLightInfo;
