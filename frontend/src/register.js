import React from "react";
import ReactDOM from "react-dom";
import "./Styles/index.scss";
import RegisterForm from "../src/Components/registerForm";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <>
        <RegisterForm />
      </>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
