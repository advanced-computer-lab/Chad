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
  return await fetch(`${BASE_URL}/search-flights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify({ attributes: data }),
  });
}

export async function getFlightwithFN(flightNumber) {
  return await fetch(`${BASE_URL}/search-flights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify({ attributes: { flightNumber } }),
  });
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
    method: "PUT",
    headers: {
      mode: "cors",
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
}
