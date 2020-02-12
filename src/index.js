import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import GithubIssueComments from "./GithubIssueComments/GithubIssueComments";

ReactDOM.render(
  <GithubIssueComments
    issueUri="sveltejs/svelte/issues/2546"
    useShowCommentsButton={true}
    commentsPerPage={5}
    allowRefreshingComments={true}
  />,
  document.getElementById("root")
);
