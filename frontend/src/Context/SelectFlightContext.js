import { createContext } from "react";

const SelectFlightContext = createContext({
  selectFlightInfo: {},
  setSelectFlightInfo: () => {},
});

export default SelectFlightContext;
