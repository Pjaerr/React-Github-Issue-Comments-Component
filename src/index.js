import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import GithubIssueComments from "./GithubIssueComments/GithubIssueComments";

ReactDOM.render(
  <GithubIssueComments issueUri="Pjaerr/Code-Flow-Extension/issues/23" />,
  document.getElementById("root")
);
