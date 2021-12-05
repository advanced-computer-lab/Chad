import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function updateUser(data) {
  return await fetch(`${BASE_URL}/user`, {
    method: "PUT",
    headers: {
      mode: "cors",
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
}

export async function getUser() {
  return await fetch(`${BASE_URL}/user-info`, {
    method: "GET",
    headers: {
      mode: "cors",
      "Content-Type": "application/json",
      token: getSession(),
    },
  });
}
