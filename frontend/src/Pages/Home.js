import { useContext, useState } from "react";
import UserContext from "../Context/UserContext";
import { ADMIN } from "../Constants/UserEnums";

import "../Styles/Components/Home.scss";

function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [classInfo, setClassInfo] = useState("");
  const { userData } = useContext(UserContext);

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleGetAll = () => {};

  return (
    <div className="page">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-form__content">
          <h2 className="search-form__title">Book Your Flight!!</h2>
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
                onChange={(target) => setClassInfo(target.value)}
              >
                <option value="business">business</option>
                <option value="first class">first class</option>
              </select>
            </div>
          </div>
          <div className="row bottom together">
            <button className="search-form__submit clickable" type="submit">
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
    </div>
  );
}

export default Home;
