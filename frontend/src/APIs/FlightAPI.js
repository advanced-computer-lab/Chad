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

export async function getFlights(data) {
  let res = await fetch(`${BASE_URL}/search-flights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify({ attributes: data }),
  });

  return res;
}

export async function deleteFlight(id) {
  return await fetch(`${BASE_URL}/flight/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
  });
}

export async function updateFlight(id, data) {
  return await fetch(`${BASE_URL}/flight/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
}