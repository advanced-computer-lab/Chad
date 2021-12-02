import { useEffect, useState } from "react";
import { TYPES } from "../Constants/ClassEnums";
import "../Styles/Components/ClassInfo.scss";

function ClassInfo({ data, onChange }) {
  const [number, setNumber] = useState(1);
  const [info, setInfo] = useState(data);
  const isAvail = number < 4;

  useEffect(() => {
    onChange(info);
  }, [info, onChange]);

  useEffect(() => {
    setInfo(data);
  }, [data]);

  const setField = (idx, name, value) => {
    info[idx][name] = value;
    setInfo([...info]);
  };
  const handleAdd = () => {
    setInfo([
      ...info,
      {
        Type: TYPES[0],
        start: 1,
        end: 1,
        priceForAdult: 1,
        priceForChild: 1,
        baggageAllowanceForAdult: 1,
        baggageAllowanceForChild: 1,
        childrenLimit: 1,
      },
    ]);
    setNumber(number + 1);
  };

  const removeInfo = (i) => {
    info.splice(i, 1);
    setNumber(number - 1);
    setInfo([...info]);
  };

  // TODO make remove class btn

  // don't render empty array
  if (info.length === 0) return <></>;

  return (
    <>
      <div className=" class-types-list">
        {[...Array(number)].map((_, i) => (
          <div className="class-info" key={i}>
            <div className="row">
              <div className="form__wrap">
                <label className="form__label" htmlFor={`class-type${i}`}>
                  Select Class Type
                </label>
                <select
                  id={`class-type${i}`}
                  className="create-flight-form__select"
                  required
                  value={info[i].Type}
                  onChange={({ target }) => setField(i, "Type", target.value)}
                >
                  <option value="" disabled hidden>
                    Choose A Class
                  </option>
                  {TYPES.map((type, i) => (
                    <option value={type} key={`calss-${i}`}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form__wrap">
                <label className="form__label" htmlFor={`ss-${i}`}>
                  Select Start Seat
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`ss-${i}`}
                  required
                  value={info[i].start}
                  onChange={({ target }) => setField(i, "start", target.value)}
                />
              </div>
              <div className="form__wrap">
                <label className="form__label" htmlFor={`es-${i}`}>
                  Select End Seat
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`es-${i}`}
                  required
                  value={info[i].end}
                  onChange={({ target }) => setField(i, "end", target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="form__wrap">
                <label className="form__label" htmlFor={`pfa-${i}`}>
                  Select Adult Ticket Price
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`pfa-${i}`}
                  required
                  value={info[i].priceForAdult}
                  onChange={({ target }) =>
                    setField(i, "priceForAdult", target.value)
                  }
                />
              </div>
              <div className="form__wrap">
                <label className="form__label" htmlFor={`pca-${i}`}>
                  Select Child Ticket Price
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`pca-${i}`}
                  required
                  value={info[i].priceForChild}
                  onChange={({ target }) =>
                    setField(i, "priceForChild", target.value)
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="form__wrap">
                <label className="form__label" htmlFor={`bafa-${i}`}>
                  Select Adult BaggageAllowance
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`bafa-${i}`}
                  required
                  value={info[i].baggageAllowanceForAdult}
                  onChange={({ target }) =>
                    setField(i, "baggageAllowanceForAdult", target.value)
                  }
                />
              </div>
              <div className="form__wrap">
                <label className="form__label" htmlFor={`bafc-${i}`}>
                  Select Child BaggageAllowance
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`bafc-${i}`}
                  required
                  value={info[i].baggageAllowanceForChild}
                  onChange={({ target }) =>
                    setField(i, "baggageAllowanceForChild", target.value)
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="form__wrap">
                <label className="form__label" htmlFor={`cl-${i}`}>
                  Select Children Limit
                </label>
                <input
                  className="create-flight-form__input"
                  type="number"
                  id={`cl-${i}`}
                  required
                  value={info[i].childrenLimit}
                  onChange={({ target }) =>
                    setField(i, "childrenLimit", target.value)
                  }
                />
              </div>
            </div>
            <button
              className="delete-btn clickable"
              disabled={number < 2}
              onClick={() => removeInfo(i)}
            >
              -
            </button>
          </div>
        ))}
      </div>
      <button
        className="clickable create-flight-form__btn"
        onClick={handleAdd}
        disabled={!isAvail}
      >
        + add classInfo
      </button>
    </>
  );
}

export default ClassInfo;
