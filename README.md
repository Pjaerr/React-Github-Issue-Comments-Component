# Github Issue Comments Component for React

A React component that uses a Github issue as a no-backend comment system for blogs.

## Overview
This is a React component that allows you to use an existing Github issue as a comment system intended for use on static blogs such as those made using Gatsby. 

It essentially recreates the github issues feed for a given issue.


![Example of Show Comments Button](https://user-images.githubusercontent.com/11336751/74346127-03fcd580-4da7-11ea-8ffa-53addf1ccd10.gif)

---
![Screenshot of component](https://user-images.githubusercontent.com/11336751/74345835-98b30380-4da6-11ea-9f1d-31ffe5731712.png)


## Usage

You will need atleast version `` of React as this component makes use of Hooks.

Firstly, grab the `GithubIssueComments` folder from the `src` folder and put it in your project wherever your components live and then import it onto your page. Example usage and the props the component takes are shown below:

**Example Usage**
```jsx
<GithubIssueComments
    issueUri="sveltejs/svelte/issues/2546"
    useShowCommentsPrompt={true}
    commentsPerPage={5}
    allowRefreshingComments={true}
  />
```

**Props**

|Name|Type|Description|
|---|---|---|
|issueUri|`string`|The URI of the github issue you want to load comments from. Using the following structure: `USER/REPOSITORY_NAME/issues/ISSUE_NUMBER`|
|useShowCommentsButton|`boolean` (optional)|Should the component be hidden behind a "Show Comments" button. True if no value is provided.|
|commentsPerPage|`number` (optional)|How many comments should be shown per page, will show pagination if there is more than 1 page and will show all comments at once if no value is provided.|
|allowRefreshingComments|`boolean` (optional)|Should the user be shown a "Check for new comments" button? True if no value is provided.|

## Using with Gatsby
It's quite simple, add this component to your blog post template and then just add an extra field to your blog posts frontmatter for an issue link and then pull it into your template using a graphql query.

## Styling the component
Currently the component works well on light themes but isn't great for darker themes. If you want to restyle the component, you can just update the single CSS file that comes with it. I am happy to accept Pull Requests for new themes as this is tailored for my blog.

## Why
I wanted to have a static blog, but still allow some form of communication method, on my first blog post I just linked to a github issue and so I figured why not just show the comments from the Github issue.

## Caveats
- Your users can't actually use this to leave a comment, instead they are redirected to the comment box on the github issue itself. This is because the Github API for actually posting a comment is blocked by CORS and so without a backend/proxy we can't do this from the client side. If you have a backend and want to extend this component to allow posting, you can follow the API [here](https://developer.github.com/v3/).

- This component was intended for my own personal blog, it has been tested as well as I have the time to, but there are bound to be issues, if you actually use the component and find an issue, please raise a Github [issue](https://github.com/Pjaerr/React-Github-Issue-Comments-Component/issues/new).

- This won't work in IE because it uses the `fetch()` function. It won't break it will just indefinitely load without making a network request. Just include a fetch polyfill or replace fetch with a library like Axios.

## Contributing
Although this component was made for myself, I am happy to accept contributions. Simply raise an issue or a pull request. 

**Getting Setup Locally**

1. Clone the repo

2. Run `npm install`

3. Run `npm start`

To adjust the props the component takes, you can edit it within the `src/index.js` file.