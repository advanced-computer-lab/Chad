import { getSession } from "../Utils/SessionUtils";
export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function editTicket(id, data) {
  return fetch(`${BASE_URL}/ticket/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
}
