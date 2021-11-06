import React from "react";
import axios from "axios";
import { useState } from "react";

function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: event.target[0].value,
      password: event.target[1].value,
    };
    axios
      .post("http://127.0.0.1:8000/login", data)
      .then((res) => {
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.log("Error in Login !", err);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        type="text"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        name="password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <input type="submit" value="login"></input>
    </form>
  );
}

export default Form;
