import { useContext, useState, useEffect, useRef } from "react";
import { ADMIN } from "../Constants/UserEnums";
import { TYPES } from "../Constants/ClassEnums";
import { getFlights } from "../APIs/FlightAPI";
import UserContext from "../Context/UserContext";
import PlaceContext from "../Context/PlaceContext";
import ToastContext from "../Context/ToastContext";
import FlightList from "../Components/FLightList";
import Paging from "../Components/Paging";
import Loading from "../Components/Loading";
import search from "../Assets/hero.svg";
import "../Styles/Components/Home.scss";

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
  const [returnPage, setReturnPage] = useState(1);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [maxRPages, setMaxRPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const isValid = flightNumber || from || to || departureDate || classInfo;

  const [flights, setFlights] = useState([]);
  const [returnFLights, setReturnFlights] = useState([]);
  const [last, setLast] = useState("SEARCH");

  const { userData } = useContext(UserContext);
  const { places } = useContext(PlaceContext);
  const { addToasts } = useContext(ToastContext);
  const mountedRef = useRef();

  useEffect(() => {
    if (!mountedRef.current) return;
    (async () => {
      await handlePageChange();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, returnPage]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const handlePageChange = async () => {
    if (last === "ALL") await handleGetAll(false);
    else await searchFlights(false);
  };

  const searchFlights = async (resetPage = true) => {
    setLast("SEARCH");
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

      setLoading(true);
      let res = await getFlights(attributes);

      if (res.status !== 200) {
        setLoading(false);
        addToasts({
          type: "danger",
          heading: "unexpected error",
        });
        return;
      }

      const result = await res.json();
      setFlights(result.flights);
      setReturnFlights(result.returnFlights);
      setMaxPages(result.maxPages);
      setMaxRPages(result.maxRPages);
      if (resetPage) {
        setPage(1);
        setReturnPage(1);
      }
      setLoading(false);

      //show feedback msgs
      if (result.flights?.length === 0)
        addToasts({
          type: "info",
          body: "no matching results for flights",
        });

      if (result.returnFLights?.length === 0)
        addToasts({
          type: "info",
          body: "no matching results for return flights",
        });
    } catch (err) {
      setLoading(false);
      addToasts({
        type: "danger",
        heading: "unexpected error",
      });
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await searchFlights();
  };

  const handleGetAll = async (resetPage = true) => {
    setLast("ALL");
    try {
      setLoading(true);
      let res = await getFlights({
        page,
      });

      if (res.status !== 200) {
        setLoading(false);
        addToasts({
          type: "danger",
          heading: "unexpected error",
        });
        return;
      }

      const result = await res.json();
      setFlights(result.flights);
      setReturnFlights([]);
      setMaxPages(result.maxPages);
      setMaxRPages(0);
      setLoading(false);
      if (resetPage) {
        setPage(1);
        setReturnPage(1);
      }

      //show feedback msgs
      if (result.flights?.length === 0)
        addToasts({
          type: "info",
          body: "no matching results for flights",
        });
    } catch (err) {
      setLoading(false);
      addToasts({
        type: "danger",
        heading: "unexpected error",
      });
    }
  };

  return (
    <div className="page home-page">
      <img
        src={search}
        alt="search"
        style={{ position: "absolute", height: "790px" }}
      />
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-form__content">
          <h2 className="search-form__title">Book Your Flight!!</h2>
          <div className="row">
            <div className="search-form__input-wrap">
              <label htmlFor="fn" className="search-form__label">
                <strong>Flight Number</strong>
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
                <strong>From</strong>
              </label>
              <select
                id="form"
                className="search-form__input"
                type="text"
                width="212"
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
                <strong>To</strong>
              </label>
              <select
                width="212"
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
              <label className="search-form__label">
                <strong>Departure Date</strong>
              </label>
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
                <label className="search-form__label">
                  <strong>Return Date</strong>
                </label>
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
            <div className="row">
              <div className="search-form__input-wrap">
                <label className="search-form__label" htmlFor="baggage-min">
                  <strong>BaggageAllowance</strong>
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
                    className="search-form__input number"
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
                    className="search-form__input number"
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
                  <strong>Price</strong>
                </label>
                <div className="row" style={{ alignItems: "center" }}>
                  <input
                    id="price-allow"
                    className="search-form__checkbox"
                    type="checkbox"
                    value={filterWithPrice}
                    onChange={({ target }) =>
                      setFilterWithPrice(target.checked)
                    }
                  ></input>
                  <input
                    id="price-min"
                    className="search-form__input number"
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
                    className="search-form__input number"
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
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="seats-adult">
                <strong>Seats</strong>
              </label>
              <div className="row" style={{ flexDirection: "column" }}>
                <div className="row">
                  <p>Adult:</p>
                  <input
                    className="search-form__input number"
                    id="seats-adult"
                    title="adult"
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
                </div>
                <div
                  className="row"
                  style={{ marginLeft: "0", marginTop: "6px" }}
                >
                  <p>Child:</p>
                  <input
                    className="search-form__input number"
                    id="seats-child"
                    title="child"
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

            <div className="search-form__input-wrap">
              <label className="search-form__label" htmlFor="select-class">
                <strong>Class</strong>
              </label>
              <div className="row">
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
          </div>
          <div className="row bottom together">
            <button
              className="search-form__submit clickable"
              type="submit"
              disabled={!isValid}
            >
              Search
            </button>
            {userData?.role === ADMIN ? (
              <button
                className="search-form__submit clickable"
                type="button"
                onClick={handleGetAll}
              >
                Get ALL
              </button>
            ) : null}
          </div>
        </div>
        {loading && !flights.length && <Loading />}
      </form>
      {flights.length ? (
        <>
          <FlightList flights={[...flights]} loading={loading} />
          <Paging
            pageNumber={page}
            onInc={() => setPage((prev) => prev + 1)}
            onDec={() => setPage((prev) => prev - 1)}
            nextA={page < maxPages}
          />
        </>
      ) : null}
      {returnFLights.length ? (
        <>
          <FlightList flights={[...returnFLights]} oading={loading} />
          <Paging
            pageNumber={returnPage}
            onInc={() => setReturnPage((prev) => prev + 1)}
            onDec={() => setReturnPage((prev) => prev - 1)}
            nextA={page < maxRPages}
          />
        </>
      ) : null}
    </div>
  );
}

export default Home;
