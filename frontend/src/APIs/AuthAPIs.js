import { getSession } from "../Utils/SessionUtils";

export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function loginReq(data) {
  return await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function registerReq(data) {
  return await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: data }),
  });
}

export async function UserInfoReq() {
  return await fetch(`${BASE_URL}/user-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: getSession(),
    },
  });
}
