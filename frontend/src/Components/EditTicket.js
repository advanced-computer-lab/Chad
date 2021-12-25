import { useEffect, useState, useContext } from "react";
import { TYPES } from "../Constants/ClassEnums";
import { getFlightwithFN } from "../APIs/FlightAPI";
import { editTicket } from "../APIs/TicketAPI";
import ToastContext from "../Context/ToastContext";
import Loading from "./Loading";
import Pay from "./Pay";
import "../Styles/Components/EditTicket.scss";

function EditTicket({ onExit, onDoneEdit, data }) {
  const {
    _id,
    classType: _type,
    isChild,
    seatNumber,
    flightNumber,
    price,
  } = data || {
    _id: null,
    classType: null,
    flightNumber: 0,
    price: 0,
    isChild: false,
  };

  const [classInfo, setClassInfo] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(seatNumber);
  const [classType, setClassType] = useState(_type);
  const [newPrice, setNewPrice] = useState(price);
  const [loading, setLoading] = useState(false);

  const { addToasts } = useContext(ToastContext);

  const classIdx = classInfo.findIndex(({ Type }) => Type === classType);
  const isValid = classIdx !== -1;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let res = await getFlightwithFN(flightNumber);

        if (res.status !== 200) {
          setLoading(false);
          onExit();
          addToasts({
            type: "danger",
            body: "faild to load flight data",
          });
          return;
        }

        let data = await res.json();
        if (data.success) {
          const { flights } = data;
          setClassInfo(flights[0].classInfo);
        } else {
          onExit();
          addToasts({
            type: "danger",
            body: "faild to load flight data",
          });
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        onExit();
        addToasts({
          type: "danger",
          body: "unexpected error",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = async (token) => {
    try {
      setLoading(true);
      let res = await editTicket(_id, {
        classType,
        seatNumber: selectedSeat,
        token,
      });
      let data = await res.json();

      if (res.status !== 200 || !data?.success) {
        setLoading(false);
        onExit();
        addToasts({
          type: "danger",
          body: "error editing the ticket",
        });
        return;
      }
      addToasts({
        type: "success",
        body: "ticket edited successfully",
      });
      onDoneEdit();
      onExit();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      onExit();
      addToasts({
        type: "danger",
        body: "unexpected errors",
      });
    }
  };

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
            .map(
              (
                {
                  start,
                  end,
                  reserverdSeats,
                  priceForAdult,
                  priceForChild,
                  Type,
                },
                i
              ) => (
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
                          : () => {
                              setSelectedSeat(start + i);
                              setNewPrice(
                                isChild ? priceForChild : priceForAdult
                              );
                            }
                      }
                    >
                      {start + i}
                    </div>
                  ))}
                </div>
              )
            )}
        </div>
        <div className="row">
          {Number(price) >= Number(newPrice) ? (
            <button
              disabled={!isValid}
              className="continue-btn clickable"
              onClick={() => handleEdit()}
            >
              Edit
            </button>
          ) : (
            <Pay
              onToken={handleEdit}
              name="Enter card Info"
              amout={newPrice - price}
            >
              <button disabled={!isValid} className="continue-btn clickable">
                Edit
              </button>
            </Pay>
          )}
        </div>
        <button className="exit-btn clickable" onClick={() => onExit()}>
          x
        </button>
      </div>
    </>
  );
}

export default EditTicket;
