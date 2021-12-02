import { createContext } from "react";

// this context holds the places
// formate is places [array]

const PlaceContext = createContext({ places: [] });

export default PlaceContext;
