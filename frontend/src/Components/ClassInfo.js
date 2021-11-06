import { useEffect, useState } from "react";
import { TYPES } from "../Constants/ClassEnums";

function ClassInfo({ onChange }) {
  const [number, setNumber] = useState(1);
  const [info, setInfo] = useState([
    {
      Type: TYPES[0],
      start: 0,
      end: 0,
    },
  ]);

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

  return (
    <>
      {[...Array(number)].map((_, i) => (
        <div key={i}>
          <select
            className="create-flight-form__class-select"
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
            className="create-flight-form__class-start"
            type="number"
            required
            value={info[i].start}
            onChange={({ target }) => setField(i, "start", target.value)}
          />
          <input
            className="create-flight-form__class-end"
            type="number"
            required
            value={info[i].end}
            onChange={({ target }) => setField(i, "end", target.value)}
          />
        </div>
      ))}
      <button className="create-flight-form__add-class" onClick={handleAdd}>
        + add classInfo
      </button>
    </>
  );
}

export default ClassInfo;
