import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function sendTmpPassword(email) {
  return fetch(`${BASE_URL}/forgetPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify({ email }),
  });
}
