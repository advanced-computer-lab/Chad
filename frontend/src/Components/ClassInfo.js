import { useEffect, useState } from "react";
import { TYPES } from "../Constants/ClassEnums";

function ClassInfo({ data, onChange }) {
  const [number, setNumber] = useState(1);
  const [info, setInfo] = useState(data);
  const isAvail = number < 4;

  useEffect(() => {
    onChange(info);
  }, [info, onChange]);

  const setField = (idx, name, value) => {
    info[idx][name] = value;
    setInfo([...info]);
  };
  const handleAdd = () => {
    setInfo([...info, { Type: TYPES[0], start: 0, end: 0 }]);
    setNumber(number + 1);
  };

  const removeInfo = (i) => {
    info.splice(i, 1);
    setNumber(number - 1);
    setInfo([...info]);
  };

  // TODO make remove class btn

  return (
    <>
      {[...Array(number)].map((_, i) => (
        <div className="row" key={i}>
          <select
            className="create-flight-form__select"
            required
            value={info[i].Type}
            onChange={({ target }) => setField(i, "Type", target.value)}
          >
            {TYPES.map((type, i) => (
              <option value={type} key={`calss-${i}`}>
                {type}
              </option>
            ))}
          </select>
          <input
            className="create-flight-form__input"
            type="number"
            required
            value={info[i].start}
            onChange={({ target }) => setField(i, "start", target.value)}
          />
          <input
            className="create-flight-form__input"
            type="number"
            required
            value={info[i].end}
            onChange={({ target }) => setField(i, "end", target.value)}
          />
          <button
            className="delete-btn clickable"
            disabled={number < 2}
            onClick={() => removeInfo(i)}
          >
            -
          </button>
        </div>
      ))}
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
