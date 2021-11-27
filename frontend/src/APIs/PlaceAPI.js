export const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function getPlaces(data) {
  let res = await fetch(`${BASE_URL}/place`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
