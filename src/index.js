import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import GithubIssueComments from "./GithubIssueComments/GithubIssueComments";

ReactDOM.render(
  <GithubIssueComments
    issueUri="pjaerr/React-Github-Issue-Comments-Component/issues/2"
    useShowCommentsPrompt={true}
  />,
  document.getElementById("root")
);
