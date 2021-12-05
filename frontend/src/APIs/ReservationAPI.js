import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function createReservation(data) {
  return fetch(`${BASE_URL}/reservation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
    body: JSON.stringify(data),
  });
}

export async function getReservations(page) {
  return fetch(`${BASE_URL}/reservations/${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
  });
}

export async function deleteTicket(id) {
  return fetch(`${BASE_URL}/ticket/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
  });
}
