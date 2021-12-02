import { useContext, useState } from "react";
import UserContext from "../Context/UserContext";
import PlaceContext from "../Context/PlaceContext";
import { ADMIN } from "../Constants/UserEnums";
import { TYPES } from "../Constants/ClassEnums";

import "../Styles/Components/Home.scss";
import FlightList from "../Components/FLightList";
import { getFlights } from "../APIs/FlightAPI";

function Home() {
  const [flightNumber, setFligtNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [classInfo, setClassInfo] = useState("");
  const [filterWithBaggaeAllwance, setFilterWithBaggageAllowance] =
    useState(false);
  const [baggageAllowance, setBaggageAllowance] = useState({ min: 0, max: 0 });
  const [filterWithPrice, setFilterWithPrice] = useState(false);
  const [price, setPrice] = useState({ min: 0, max: 0 });
  const [neededSeats, setNeededSeats] = useState({ child: 0, adult: 1 });
  const [isRoundtrip, setIsRoundtrip] = useState(false);
  const [roundDate, setRoundDate] = useState("");
  // TODO setReturnPage
  const [returnPage] = useState(1);
  const [page, setPage] = useState(1);

  const isValid = flightNumber || from || to || departureDate || classInfo;

  const [flights, setFlights] = useState([]);
  const { userData } = useContext(UserContext);
  const { places } = useContext(PlaceContext);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      // formate the attributs to filter with
      let attributes = {
        arrivalLocation: to,
        departureLocation: from,
        departure: departureDate,
        availableSeats: neededSeats,
        roundtrip: isRoundtrip,
        classInfo,
        flightNumber,
        page,
        returnPage,
        roundDate,
      };
      if (filterWithPrice) attributes["priceForAdult"] = price;
      if (filterWithBaggaeAllwance)
        attributes["baggageAllowanceForAdult"] = baggageAllowance;

      let res = await getFlights(attributes);

      // TODO
      if (res.status !== 200) {
        return;
      }

      const result = await res.json();
      setFlights(result.flights);
    } catch (err) {
      //TODO handle err and show msg
    }
  };

  const handleGetAll = async () => {
    try {
      let res = await getFlights({
        page,
      });

      if (res.status !== 200) return;

      const result = await res.json();
      setFlights(result.flights);
    } catch (err) {
      //TODO handle err and show msg
    }
  };

  return (
    <div className="page home-page">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-form__content">
          <h2 className="search-form__title">Book Your Flight!!</h2>
          <div className="row">
            <div className="search-form__input-wrap">
              <label htmlFor="fn" className="search-form__label">
                Flight Number
              </label>
              <input
                id="fn"
                className="search-form__input"
                type="text"
                value={flightNumber}
                onChange={({ target }) => setFligtNumber(target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label htmlFor="from" className="search-form__label">
                From
              </label>
              <select
                id="form"
                className="search-form__input"
                type="text"
                value={from}
                onChange={({ target }) => setFrom(target.value)}
              >
                <option value="" disabled hidden>
                  Choose Your Location
                </option>
                {places.map(({ name, _id }, i) => (
                  <option key={`place-${i}`} value={_id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-form__input-wrap">
              <label htmlFor="to" className="search-form__label">
                To
              </label>
              <select
                id="to"
                className="search-form__input"
                type="text"
                value={to}
                onChange={({ target }) => setTo(target.value)}
              >
                <option value="" disabled hidden>
                  Choose Your Destination
                </option>
                {places.map(({ name, _id }, i) => (
                  <option key={`place-${i}`} value={_id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div
              className="search-form__input-wrap row"
              style={{ alignItems: "center", padding: "10px 0px 0px 0px" }}
            >
              <input
                id="is-roundtrip"
                className="search-form__checkbox"
                type="checkbox"
                value={departureDate}
                onChange={({ target }) => setIsRoundtrip(target.checked)}
              ></input>
              <label className="" htmlFor="is-roundtrip">
                RoundTrip
              </label>
            </div>
          </div>

          <div className="row" style={{ paddingTop: "1px" }}>
            <div
              className="search-form__input-wrap"
              style={{ paddingTop: "0px" }}
            >
              <label className="search-form__label">Departure Date</label>
              <input
                id="d-date"
                className="search-form__input"
                type="date"
                value={departureDate}
                onChange={({ target }) => setDepartureDate(target.value)}
              ></input>
            </div>
            {isRoundtrip && (
              <div className="search-form__input-wrap">
                <label className="search-form__label">Return Date</label>
                <input
                  id="r-date"
                  className="search-form__input"
                  type="date"
                  value={roundDate}
                  onChange={({ target }) => setRoundDate(target.value)}
                ></input>
              </div>
            )}
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="baggage-min">
                BaggageAllowance
              </label>
              <div className="row" style={{ alignItems: "center" }}>
                <input
                  id="baggage-allow"
                  className="search-form__checkbox"
                  type="checkbox"
                  value={filterWithBaggaeAllwance}
                  onChange={({ target }) =>
                    setFilterWithBaggageAllowance(target.checked)
                  }
                ></input>
                <input
                  id="baggage-min"
                  className="search-form__input"
                  type="number"
                  value={baggageAllowance.min}
                  disabled={!filterWithBaggaeAllwance}
                  onChange={({ target }) =>
                    setBaggageAllowance((prev) => {
                      return {
                        min: target.value,
                        max: Math.max(prev.max, target.value),
                      };
                    })
                  }
                ></input>
                <input
                  id="baggage-max"
                  className="search-form__input"
                  type="number"
                  value={baggageAllowance.max}
                  disabled={!filterWithBaggaeAllwance}
                  onChange={({ target }) =>
                    setBaggageAllowance((prev) => {
                      return {
                        min: Math.min(prev.min, target.value),
                        max: target.value,
                      };
                    })
                  }
                ></input>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="price-min">
                Price
              </label>
              <div className="row" style={{ alignItems: "center" }}>
                <input
                  id="price-allow"
                  className="search-form__checkbox"
                  type="checkbox"
                  value={filterWithPrice}
                  onChange={({ target }) => setFilterWithPrice(target.checked)}
                ></input>
                <input
                  id="price-min"
                  className="search-form__input"
                  type="number"
                  value={price.min}
                  disabled={!filterWithPrice}
                  onChange={({ target }) =>
                    setPrice((prev) => {
                      return {
                        min: target.value,
                        max: Math.max(prev.max, target.value),
                      };
                    })
                  }
                ></input>
                <input
                  id="price-  max"
                  className="search-form__input"
                  type="number"
                  value={price.max}
                  disabled={!filterWithPrice}
                  onChange={({ target }) =>
                    setPrice((prev) => {
                      return {
                        min: Math.min(prev.min, target.value),
                        max: target.value,
                      };
                    })
                  }
                ></input>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="seats-adult">
                Seats
              </label>
              <div className="row">
                <input
                  className="search-form__input"
                  id="seats-adult"
                  type="number"
                  value={neededSeats.adult}
                  min="1"
                  onChange={({ target }) =>
                    setNeededSeats((prev) => ({
                      ...prev,
                      adult: Number(target.value),
                    }))
                  }
                />
                <input
                  className="search-form__input"
                  id="seats-child"
                  type="number"
                  value={neededSeats.child}
                  min="0"
                  onChange={({ target }) =>
                    setNeededSeats((prev) => ({
                      ...prev,
                      child: Number(target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="select-class">
                Class
              </label>
              <select
                className="search-form__select"
                id="select-class"
                value={classInfo}
                onChange={({ target }) => setClassInfo(target.value)}
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
            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="page">
                Page
              </label>
              <input
                className="search-form__input"
                id="page"
                type="number"
                value={page}
                min="1"
                onChange={({ target }) => setPage(Number(target.value))}
              />
            </div>
          </div>
          <div className="row bottom together">
            <button
              className="search-form__submit clickable"
              type="submit"
              disabled={!isValid}
            >
              Seach
            </button>
            {userData?.role === ADMIN ? (
              <button
                className="search-form__submit clickable"
                onClick={handleGetAll}
              >
                Get ALL
              </button>
            ) : null}
          </div>
        </div>
      </form>
      <FlightList flights={[...flights]} />
    </div>
  );
}

export default Home;
