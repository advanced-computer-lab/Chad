import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function addFlight(data) {
  let res = await fetch(`${BASE_URL}/flight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO remove the static token after implement the session
      token:
        getSession() ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODU4Y2Q0OTlhY2Y4MjhlZmY3NWNhYyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzNjE2NDM3MH0.VtwAzR6U9U1k2MfzElqertzPLIehyLqNrKVMny3YHSE",
    },
    body: JSON.stringify(data),
  });
  return res;
}
