/// <reference types="react" />
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
declare const GithubIssueComments: ({ issueUri, useShowCommentsButton, allowRefreshingComments, commentsPerPage, }: Props) => JSX.Element;

export { GithubIssueComments };
