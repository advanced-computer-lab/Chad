import Form from "./Components/Form";
import React from "react";
import ReactDOM from "react-dom";
import "./Styles/index.scss";
import { BrowserRouter as Router } from "react-router-dom";
let inputs = [
  { label: "Username", type: "text", name: "username", required: true },
  { label: "Password", type: "password", name: "password", required: "true" },
];

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <>
        <Form inputsList={inputs} />
      </>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
