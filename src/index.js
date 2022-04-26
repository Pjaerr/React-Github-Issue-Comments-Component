import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import GithubIssueComments from "./GithubIssueComments";

ReactDOM.render(
  <GithubIssueComments
    issueUri="Pjaerr/Svelte-Electron-Desktop-App/issues/1"
    useShowCommentsButton={false}
    commentsPerPage={5}
    allowRefreshingComments={true}
    direction="asc"
  />,
  document.getElementById("root")
);
