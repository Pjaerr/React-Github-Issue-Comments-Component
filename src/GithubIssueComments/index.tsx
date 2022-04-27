import React, { useCallback, useEffect, useState } from "react";

import "./index.css";

interface Props {
  /**
   * The URI of the github issue you want to load comments from. Using the following structure: `USER/REPOSITORY_NAME/issues/ISSUE_NUMBER`
   */
  issueUri: string;
  /**
   * Should the comments (and their network request) be hidden behind a "Show Comments" button. True if no value is provided
   */
  useShowCommentsButton?: boolean;
  /**
   * How many comments should be shown per page, will show pagination if there is more than 1 page and will show 100 comments on a single page if no value is provided.
   */
  commentsPerPage?: number;
  /**
   * Should the user be shown a "Check for new comments" button? True if no value is provided.
   */
  allowRefreshingComments?: boolean;
}

const GithubIssueComments = ({
  issueUri,
  useShowCommentsButton = true,
  allowRefreshingComments = true,
  commentsPerPage = 100,
}: Props) => {
  const [showComments, setShowComments] = useState(!useShowCommentsButton);

  return (
    <section className="GithubIssueComments-container">
      {showComments ? (
        <GithubIssueCommentsCore
          issueUri={issueUri}
          commentsPerPage={commentsPerPage}
          allowRefreshingComments={allowRefreshingComments}
        />
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

interface Comment {
  body: { __html: string };
  user: { username: string; avatarUrl: string; isRepositoryOwner: boolean };
  createdAt: string;
}

interface PaginationHeaders {
  next: number | undefined;
  previous: number | undefined;
  first: number | undefined;
  last: number | undefined;
}

const parseLinkHeaders = (link: string): PaginationHeaders => {
  const links = link.split(",").map((l: string) => {
    let page;

    const pageAsString = l.match(/\?\page=./g)?.[0].replace("?page=", "");

    if (pageAsString) {
      page = parseInt(pageAsString, 10);
    }

    const rel = /rel=".*"/g.exec(l)?.[0].replace('rel="', "").replace('"', "");

    return {
      rel,
      page,
    };
  });

  const next = links.find(({ rel }) => rel === "next")?.page;
  const previous = links.find(({ rel }) => rel === "previous")?.page;
  const first = links.find(({ rel }) => rel === "first")?.page;
  const last = links.find(({ rel }) => rel === "last")?.page;

  return {
    next,
    previous,
    first,
    last,
  };
};

const GithubIssueCommentsCore = ({
  issueUri,
  allowRefreshingComments,
  commentsPerPage,
}: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsHaveLoaded, setCommentsHaveLoaded] = useState(false);

  const [paginationHeaders, setPaginationHeaders] =
    useState<PaginationHeaders | null>(null);

  const [page, setPage] = useState(1);

  const loadComments = () => {
    if (window.fetch !== undefined) {
      setCommentsHaveLoaded(false);

      fetch(
        `https://api.github.com/repos/${issueUri}/comments?page=${page}&per_page=${commentsPerPage}`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.v3.html+json",
          },
        }
      )
        .then((res) => {
          const link = res.headers.get("link");

          if (link) {
            setPaginationHeaders(parseLinkHeaders(link));
          }

          return res.json();
        })
        .then((data) => {
          if (data.message === "Not Found") {
            console.error(`The issueUri: "${issueUri}" doesn't exist`);
          } else if (data.message) {
            console.error(data.message);
          } else {
            const allComments: Comment[] = [];

            for (const comment of data) {
              allComments.push({
                body: { __html: comment["body_html"] },
                user: {
                  username: comment.user.login,
                  avatarUrl: comment.user["avatar_url"],
                  isRepositoryOwner: comment["author_association"] === "OWNER",
                },
                createdAt: comment["created_at"],
              });
            }

            setComments(allComments);
            setCommentsHaveLoaded(true);
          }
        });
    }
  };

  useEffect(loadComments, [issueUri, page]);

  if (commentsHaveLoaded) {
    return (
      <>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.user.username + "_" + comment.createdAt}
              body={comment.body}
              user={comment.user}
              createdAt={comment.createdAt}
            />
          ))
        ) : (
          <NoCommentsFound />
        )}

        {paginationHeaders && (
          <Pagination
            activePage={page}
            numberOfPages={
              paginationHeaders?.last ? paginationHeaders.last : page
            }
            onPageChange={(pageNumber) => setPage(pageNumber)}
          />
        )}

        {allowRefreshingComments && (
          <RefreshCommentsButton onRefresh={loadComments} />
        )}

        <NewCommentButton
          redirectUrl={`https://github.com/${issueUri}#issue-comment-box`}
        />
      </>
    );
  }

  return <LoadingComments />;
};

interface PaginationProps {
  activePage: number;
  numberOfPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({
  activePage,
  numberOfPages,
  onPageChange,
}: PaginationProps) => {
  const buttons = [];

  for (let i = 1; i <= numberOfPages; ++i) {
    buttons.push(
      <button
        key={i}
        className={
          activePage === i
            ? "GithubIssueComments-pagination-button GithubIssueComments-pagination-button-active"
            : "GithubIssueComments-pagination-button"
        }
        onClick={() => {
          onPageChange(i);
        }}
      >
        {i}
      </button>
    );
  }

  return <div className="GithubIssueComments-pagination">{buttons}</div>;
};

interface RefreshCommentsButtonProps {
  onRefresh: () => void;
}

const RefreshCommentsButton = ({ onRefresh }: RefreshCommentsButtonProps) => {
  const [allowCommentsRefresh, setAllowCommentsRefresh] = useState(false);

  return (
    <button
      className="GithubIssueComments-refresh-comments-button"
      disabled={allowCommentsRefresh}
      onClick={() => {
        setAllowCommentsRefresh(true);
        onRefresh();
        setTimeout(() => setAllowCommentsRefresh(false), 1000);
      }}
    >
      Check for new comments
    </button>
  );
};

const Comment = ({ body, user, createdAt }: Comment) => {
  const contentElementSetup = useCallback((node: HTMLParagraphElement) => {
    if (node !== null) {
      const emailElements = [
        node.querySelector(".email-hidden-toggle"),
        node.querySelector(".email-hidden-reply"),
      ];

      emailElements.forEach((element) => {
        if (element) {
          node.removeChild(element);
        }
      });
    }
  }, []);

  return (
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
            <span>
              {" "}
              commented on {new Date(createdAt).toLocaleDateString()}
            </span>
          </b>
        </div>
        <div className="GithubIssueComments-comment-box-body">
          <p ref={contentElementSetup} dangerouslySetInnerHTML={body}></p>
        </div>
      </div>
    </div>
  );
};

const NoCommentsFound = () => (
  <p className="GithubIssueComments-no-comments-found">
    No comments found{" "}
    <span role="img" aria-label="Smiley Face Emoji">
      🙁
    </span>
  </p>
);

interface NewCommentButtonProps {
  redirectUrl: string;
}

const NewCommentButton = ({ redirectUrl }: NewCommentButtonProps) => (
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

export default GithubIssueComments;
