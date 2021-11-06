import React from "react";
import axios from "axios";
import { useState } from "react";

function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: event.target[0].value,
      email: event.target[1].value,
      password: event.target[2].value,
      age: event.target[3].value,
      mobile: event.target[4].value,
    };
    console.log(data);
    axios
      .post("http://127.0.0.1:8000/register", data)
      .then((res) => {
        console.log(res);
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setMobile("");
      })
      .catch((err) => {
        console.log("Error in Register !", err);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="name"
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      ></input>

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

      <input
        name="age"
        value={age}
        type="text"
        onChange={(e) => setAge(e.target.value)}
      ></input>

      <input
        name="mobile"
        value={mobile}
        type="text"
        onChange={(e) => setMobile(e.target.value)}
      ></input>

      <input type="submit" value="register"></input>
    </form>
  );
}

export default Form;
