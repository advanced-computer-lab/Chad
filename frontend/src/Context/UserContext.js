import { createContext } from "react";

// this context takes two values
// first user data `userData: {}`
// second user data set function `setUserData: () => {}`
const UserContext = createContext({});

export default UserContext;
