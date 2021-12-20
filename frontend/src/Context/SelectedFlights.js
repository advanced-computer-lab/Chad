import { createContext } from "react";

// this context is to hold the selected flights to book
// it will contain selected as an array of flight
// and a function to modify the flights
const SelectedFlights = createContext({});

export default SelectedFlights;
