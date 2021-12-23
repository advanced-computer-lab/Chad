import { useEffect, useState } from "react";
import { TYPES } from "../Constants/ClassEnums";
import { getFlightwithFN } from "../APIs/FlightAPI";
import Loading from "./Loading";
import "../Styles/Components/EditTicket.scss";

function EditTicket({ onExit, data }) {
  const {
    classType: _type,
    isChild,
    seatNumber,
    flightNumber,
  } = data || {
    classType: null,
    flightNumber: 0,
    isChild: false,
  };

  const [classInfo, setClassInfo] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(seatNumber);
  const [classType, setClassType] = useState(_type);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let res = await getFlightwithFN(flightNumber);

      if (res.status !== 200) {
        console.log(await res.json());
        //TODO error Msg
        setLoading(false);

        return;
      }

      let data = await res.json();
      if (data.success) {
        const { flights } = data;
        setClassInfo(flights[0].classInfo);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {};

  return (
    <>
      <div className="edit-ticket__overlay" onClick={() => onExit()} />
      <div className="edit-ticket">
        {loading && <Loading />}
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
              value={isChild ? 0 : 1}
              disabled
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
              value={isChild ? 1 : 0}
              disabled
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
                    } ${selectedSeat === start + i ? "selected" : ""}`}
                    onClick={
                      reserverdSeats.includes(start + i)
                        ? () => {}
                        : () => setSelectedSeat(start + i)
                    }
                  >
                    {start + i}
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="row">
          <button className="continue-btn clickable" onClick={handleEdit}>
            Edit
          </button>
        </div>
        <button className="exit-btn clickable" onClick={() => onExit()}>
          x
        </button>
      </div>
    </>
  );
}

export default EditTicket;
