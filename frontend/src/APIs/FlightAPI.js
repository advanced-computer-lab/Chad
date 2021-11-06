import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function addFlight(data) {
  let res = await fetch(`${BASE_URL}/flight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
  return res;
}
