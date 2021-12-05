import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function getUserInfo() {
  return fetch(`${BASE_URL}/user-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
  });
}

export async function updateUserInfo(data) {
  return fetch(`${BASE_URL}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
}
