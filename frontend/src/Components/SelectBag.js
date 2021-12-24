import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { saveToLS, removeFromLS } from "../Utils/storageUtils.js";
import { createReservation } from "../APIs/ReservationAPI";
import UserContext from "../Context/UserContext";
import SelectedFlights from "../Context/SelectedFlights";
import ToastContext from "../Context/ToastContext";
import Flight from "./Flight";
import Pay from "./Pay";
import Loading from "./Loading";
import "../Styles/Components/SelectBag.scss";

function SelectBag() {
  const { selectedFlights, setSelectedFlights } = useContext(SelectedFlights);
  const { userData } = useContext(UserContext);
  const { addToasts } = useContext(ToastContext);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toPay, setToPay] = useState("");
  const isAuth = userData && Object.keys(userData).length;
  const history = useHistory();

  useEffect(() => {
    let total = 0,
      payStr = [];
    for (let {
      classInfo,
      classType,
      numberOfChild,
      numberOfAdult,
    } of selectedFlights) {
      const { priceForAdult, priceForChild } = classInfo.find(
        ({ Type }) => Type === classType
      );
      payStr.push(
        `${numberOfChild} child x ${priceForChild} + ${numberOfAdult} Adult x ${priceForAdult}`
      );
      total += numberOfChild * priceForChild + numberOfAdult * priceForAdult;
    }

    // setToPay(payStr.join(", ") + ` = ${total.toFixed(2)}`);
    setToPay(`${total.toFixed(2)}`);
  }, [selectedFlights]);

  const handelShow = () => {
    setShow((prev) => !prev);
  };
  const handelRemove = (flightNumber) => {
    setSelectedFlights((prev) =>
      prev.filter((f) => f.flightNumber !== flightNumber)
    );
    if (selectedFlights.length === 1) setShow(false);
    removeFromLS("FLIGHTSTOBOOK");
  };

  const handelBook = async (token) => {
    try {
      setLoading(true);
      let tickets = [];

      // formate the arguments
      for (let flight of selectedFlights) {
        let _flight = { ...flight };
        let _class = _flight.classInfo.filter(
          ({ Type }) => Type === _flight.classType
        )[0];
        _flight.seats = _flight.selectedSeats.map((sn, i) => ({
          seatNumber: sn,
          price:
            i < _flight.numberOfChild
              ? _class.priceForChild
              : _class.priceForAdult,
          isChild: i < _flight.numberOfChild,
        }));
        _flight.date = new Date();
        _flight.departureLocation = _flight.departureLocation._id;
        _flight.arrivalarrivalLocation = _flight.arrivalLocation._id;
        delete _flight.selectedSeats;
        tickets.push(_flight);
      }

      let res = await createReservation({ tickets, token });

      if (res.status !== 200) {
        addToasts({
          type: "danger",
          body: "faild to add reservation",
        });
        setLoading(false);
        return;
      }

      addToasts({
        type: "success",
        body: "reservation added successfully",
      });
      setLoading(false);
      setSelectedFlights([]);
      setShow(false);
    } catch (err) {
      addToasts({
        type: "danger",
        body: "unexpected error",
      });
      setLoading(false);
    }
  };
  const handelLoginRedirect = () => {
    saveToLS("FLIGHTSTOBOOK", selectedFlights);
    history.push("/login");
  };

  return (
    <>
      <div
        className={`selected-bag__overlay ${show ? "show-overlay" : ""}`}
        onClick={handelShow}
      ></div>
      <div className={`select-bag ${show ? "show-bag" : ""}`}>
        {show && loading && <Loading />}
        <div className="row cards">
          {selectedFlights.map((f, i) => (
            <Flight
              key={i}
              data={f}
              editable={false}
              showX={true}
              choosen={true}
              onRemove={handelRemove}
            />
          ))}
        </div>
        <div className="ticket">
          <div className="body">
            <h3>
              CHAD <span>Airlines</span>
            </h3>
            <div style={{ display: "flex", height: "100%" }}>
              {selectedFlights.map((flight, i) => (
                <div className="ticket-cont" key={i}>
                  <div className="row">
                    <p className="flight-n">
                      <strong># {flight?.flightNumber}</strong>
                    </p>
                  </div>
                  <div className="row">
                    <div>
                      <p>
                        <strong>AirPort</strong>
                      </p>
                      {flight?.departureLocation.name}
                    </div>
                    <div>
                      <p>
                        <strong>Dst. AirPort</strong>
                      </p>
                      {flight?.arrivalLocation.name}
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <p>
                        <strong>DATE & TIME</strong>
                      </p>
                      {flight?.departure}
                    </div>
                    <div>
                      <p>
                        <strong>Dst. DATE & TIME</strong>
                      </p>
                      {flight?.arrival}
                    </div>
                  </div>
                  <div className="row">
                    <div style={{ width: "100%" }}>
                      <p>
                        <strong>Seats</strong>
                      </p>
                      {flight?.selectedSeats.map((s, i) => (
                        <div className="seat" key={i}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <p>
                        <strong>Adults</strong>
                      </p>
                      {flight?.numberOfAdult}
                    </div>
                    {!!flight?.numberOfChild && (
                      <div>
                        <p>
                          <strong>Childrens</strong>
                        </p>
                        {flight?.numberOfChild}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tail">
            <p className="pay-amount">{toPay} $</p>
          </div>
        </div>
        {selectedFlights.length ? (
          <button className="show clickable" onClick={handelShow}>
            {selectedFlights.length}
          </button>
        ) : (
          ""
        )}
        {false && (
          <div className="price">
            TOTAL TO PAY:
            <strong style={{ color: "white" }}>{toPay} $</strong>
          </div>
        )}
        {show && (
          <div className="row book-div">
            {isAuth ? (
              <Pay
                onToken={handelBook}
                name="Enter your Card Info"
                amount={Number(toPay)}
              >
                <button className="clickable book-btn">Book</button>
              </Pay>
            ) : (
              <button
                className="clickable book-btn"
                onClick={handelLoginRedirect}
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SelectBag;
