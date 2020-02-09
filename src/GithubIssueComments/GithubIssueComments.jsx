import React, { useEffect, useState } from "react";

import "./GithubIssueComments.css";

const GithubIssueComments = ({ issueUri }) => {
  const [comments, setComments] = useState([]);
  const [commentsHaveLoaded, setCommentsHaveLoaded] = useState(false);

  useEffect(() => {
    const url = `https://api.github.com/repos/${issueUri}/comments`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.html+json"
      }
    })
      .then(res => res.json())
      .then(data => {
        setCommentsHaveLoaded(true);
        setComments(
          data.map(comment => {
            return {
              body: { __html: comment["body_html"] },
              user: {
                username: comment.user.login,
                avatarUrl: comment.user["avatar_url"],
                isRepositoryOwner: comment["author_association"] === "OWNER"
              },
              createdAt: comment["created_at"]
            };
          })
        );
      });
  }, [issueUri]);

  if (commentsHaveLoaded) {
    return (
      <section className="GithubIssueComments-container">
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              body={comment.body}
              user={comment.user}
              createdAt={comment.createdAt}
            />
          ))
        ) : (
          <p>No comments found!</p>
        )}
        <a
          className="GithubIssueComments-comment-button"
          href={`https://github.com/${issueUri}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Comment via Github
        </a>
      </section>
    );
  } else {
    return (
      <section className="GithubIssueComments-container">
        <p>Loading comments...</p>
      </section>
    );
  }
};

const Comment = ({ body, user, createdAt }) => (
  <div className="GithubIssueComments-comment">
    <img src={user.avatarUrl} alt={`Avatar of ${user.username}`} />

    <div className="GithubIssueComments-comment-box">
      <div
        className={
          user.isRepositoryOwner
            ? "GithubIssueComments-comment-box-header GithubIssueComments-comment-box-header-isOwner"
            : "GithubIssueComments-comment-box-header"
        }
      >
        <b className="GithubIssueComments-comment-box-header-username">
          {user.username}
          <span> commented on {new Date(createdAt).toLocaleDateString()}</span>
        </b>
      </div>
      <div className="GithubIssueComments-comment-box-body">
        <p dangerouslySetInnerHTML={body}></p>
      </div>
    </div>
  </div>
);

export default GithubIssueComments;
