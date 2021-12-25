import { createContext } from "react";

const UserLevelContext = createContext({ level: "", setLevel: () => {} });

export default UserLevelContext;
