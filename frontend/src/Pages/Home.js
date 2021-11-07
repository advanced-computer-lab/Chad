import { useContext, useState } from "react";
import UserContext from "../Context/UserContext";
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
  const [page, setPage] = useState(1);

  const isValid = flightNumber || from || to || departureDate || classInfo;

  const [flights, setFlights] = useState([]);
  const { userData } = useContext(UserContext);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      let res = await getFlights({
        arrivalLocation: to,
        departureLocation: from,
        classInfo,
        departure: departureDate,
        flightNumber,
        page,
      });

      // TODO
      if (res.status !== 200) return;

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
              <input
                id="form"
                className="search-form__input"
                type="text"
                value={from}
                onChange={({ target }) => setFrom(target.value)}
              ></input>
            </div>
            <div className="search-form__input-wrap">
              <label htmlFor="to" className="search-form__label">
                To
              </label>
              <input
                id="to"
                className="search-form__input"
                type="text"
                value={to}
                onChange={({ target }) => setTo(target.value)}
              ></input>
            </div>
          </div>
          <div className="row">
            <div className="search-form__input-wrap">
              <label className="search-form__label">Departure Date</label>
              <input
                id="d-date"
                className="search-form__input"
                type="date"
                value={departureDate}
                onChange={({ target }) => setDepartureDate(target.value)}
              ></input>
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
