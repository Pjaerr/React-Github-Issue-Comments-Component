import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

import GithubIssueComments from "./GithubIssueComments/GithubIssueComments";

const App = () => (
  <div style={{ width: "100%" }}>
    <GithubIssueComments
      issueUri="vuejs/vue/issues/7088"
      useShowCommentsPrompt={true}
    />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
