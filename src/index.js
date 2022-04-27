import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import GithubIssueComments from "./GithubIssueComments";

ReactDOM.render(
  <GithubIssueComments
    issueUri="emberjs/rfcs/issues/777"
    useShowCommentsButton={false}
    commentsPerPage={3}
    allowRefreshingComments={true}
    direction="asc"
  />,
  document.getElementById("root")
);
