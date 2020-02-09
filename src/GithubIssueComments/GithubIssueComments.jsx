import React, { useEffect, useState } from "react";

import "./GithubIssueComments.css";

/**
 * Utilise an existing Github Issue as a comment thread
 *
 * Props:
 * ---
 * @param {string} issueUri The URI of the github issue you want to load comments from.
 * Using the following structure: `USER/REPOSITORY_NAME/issues/ISSUE_NUMBER`
 *
 * @param {boolean} useShowCommentsPrompt Should the comments (and their network request) be hidden behind a
 * "Show Comments" button
 */
const GithubIssueComments = ({ issueUri, useShowCommentsPrompt }) => {
  const [showComments, setShowComments] = useState(!useShowCommentsPrompt);

  return (
    <section className="GithubIssueComments-container">
      {showComments ? (
        <GithubIssueCommentsCore issueUri={issueUri} />
      ) : (
        <button
          className="GithubIssueComments-show-comments-button"
          onClick={() => setShowComments(true)}
        >
          Show Comments
        </button>
      )}
    </section>
  );
};

const GithubIssueCommentsCore = ({ issueUri }) => {
  const [comments, setComments] = useState([]);
  const [commentsHaveLoaded, setCommentsHaveLoaded] = useState(false);

  useEffect(() => {
    /*Make a GET request to the github API for comments at the provided IssueUri. Request that
    the comment body be formatted as HTML.*/
    fetch(`https://api.github.com/repos/${issueUri}/comments`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.html+json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.message) {
          setCommentsHaveLoaded(true);

          //Store comments in more usable format
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
        } else {
          console.error(`The issueUri: "${issueUri}" doesn't exist`);
        }
      });
  }, [issueUri]);

  if (commentsHaveLoaded) {
    return (
      <>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              key={comment.user + "_" + comment.createdAt}
              body={comment.body}
              user={comment.user}
              createdAt={comment.createdAt}
            />
          ))
        ) : (
          <NoCommentsFound />
        )}
        <NewCommentButton
          redirectUrl={`https://github.com/${issueUri}#issue-comment-box`}
        />
      </>
    );
  }

  return <LoadingComments />;
};

const NoCommentsFound = () => (
  <p className="GithubIssueComments-no-comments-found">No comments found 🙁</p>
);

const NewCommentButton = ({ redirectUrl }) => (
  <a
    className="GithubIssueComments-new-comment-button"
    href={redirectUrl}
    target="_blank"
    rel="noopener noreferrer"
  >
    Write a Comment via Github
  </a>
);

const LoadingComments = () => (
  <section className="GithubIssueComments-container">
    <div className="GithubIssueComments-loading-icon"></div>
  </section>
);

const Comment = ({ body, user, createdAt }) => (
  <div className="GithubIssueComments-comment">
    <a
      className="GithubIssueComments-comment-user-avatar"
      href={`https://github.com/${user.username}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={user.avatarUrl} alt={`Avatar of ${user.username}`} />
    </a>

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
