import React, { useEffect, useState } from "react";

import "./GithubIssueComments.css";

const GithubIssueComments = ({ issueUri }) => {
  const [comments, setComments] = useState([]);
  const [commentsHaveLoaded, setCommentsHaveLoaded] = useState(false);

  useEffect(() => {
    const url = `https://api.github.com/repos/${issueUri}/comments`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCommentsHaveLoaded(true);
        setComments(
          data.map(comment => {
            return {
              body: comment.body,
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

  return (
    <section className="githubissuecomments-container">
      <h1>Comments</h1>

      {commentsHaveLoaded ? (
        comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              body={comment.body}
              user={comment.user}
              createdAt={comment.createdAt}
            />
          ))
        ) : (
          <p>No comments found!</p>
        )
      ) : (
        <p>Loading comments...</p>
      )}
    </section>
  );
};

const Comment = ({ body, user, createdAt }) => (
  <div className="githubissuecomments-comment">
    <div className="githubissuecomment-comment-header">
      <img src={user.avatarUrl} alt={`Avatar of ${user.username}`} />
      <b
        className={
          user.isRepositoryOwner
            ? "githubissuecomment-comment-user githubissuecomment-comment-user-isOwner"
            : "githubissuecomment-comment-user"
        }
      >
        {user.username}
      </b>
    </div>
    <div className="githubissuecomment-comment-body">
      <p>{body}</p>
    </div>
    <div className="githubissuecomment-comment-createdAt">
      <p>{new Date(createdAt).toLocaleString()}</p>
    </div>
  </div>
);

export default GithubIssueComments;
