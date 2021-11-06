import React from "react";
import ReactDOM from "react-dom";
import "./Styles/index.scss";
import LoginForm from "../src/Components/loginForm";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <>
        <LoginForm />
      </>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
