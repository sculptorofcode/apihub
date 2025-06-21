# IdeaGenine

A Next.js application that provides API endpoints for fetching and searching content from various social media platforms including Reddit, Dev.to, and X.com (Twitter).

## Features

- 🔍 Search Reddit posts by keyword with comments
- 📝 Fetch Dev.to articles with keyword/tag filtering and comments
- 🐦 Search X.com (Twitter) tweets with replies
- 💬 Nested comment structure support
- 🌍 English content filtering
- ⚡ Fast API responses with error handling

## Getting Started

First, set up your environment variables by creating a `.env` file:

```bash
# API key for external services
X_API_KEY=your_x_api_key_here

# Reddit API configuration
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=u/your_username
REDDIT_APP_NAME=YourAppName

# Keyword search API key
KEYWORD_SEARCH_API=your_keyword_search_api_key

# MongoDB database credentials
MONGODB_PASSWORD=your_mongodb_password
MONGODB_USERNAME=your_mongodb_username
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

### 1. Reddit API - Search Posts

Search Reddit posts by keyword and fetch comments with nested replies.

**Endpoint:** `GET /api/reddit?keyword={search_term}`

**Parameters:**
- `keyword` (required): Search term for Reddit posts

**Example Requests:**
```bash
# Search for AI-related posts
GET http://localhost:3000/api/reddit?keyword=artificial%20intelligence

# Search for programming posts
GET http://localhost:3000/api/reddit?keyword=programming
```

**Response Format:**
```json
[
  {
    "body": "Post content or title",
    "url": "https://www.reddit.com/r/subreddit/comments/...",
    "post_comments": 25,
    "post_like": 150,
    "comments": [
      {
        "body": "Main comment text",
        "sub_comments": [
          "Nested reply 1",
          "Nested reply 2"
        ]
      }
    ]
  }
]
```

### 2. Dev.to API - Fetch Articles

Fetch Dev.to articles with keyword/tag filtering and nested comments.

**Endpoint:** `GET /api/dev.to`

**Parameters:**
- `keyword` (optional): Search term for articles
- `tag` (optional): Filter by specific tag
- `limit` (optional): Number of articles to fetch (default: 10)

**Example Requests:**
```bash
# Search by keyword
GET http://localhost:3000/api/dev.to?keyword=javascript&limit=10

# Filter by tag
GET http://localhost:3000/api/dev.to?tag=react&limit=5

# Combine keyword and tag
GET http://localhost:3000/api/dev.to?keyword=tutorial&tag=javascript&limit=15

# Get latest articles
GET http://localhost:3000/api/dev.to?limit=10
```

**Response Format:**
```json
[
  {
    "title": "Article Title",
    "url": "https://dev.to/username/article-slug",
    "author": "username",
    "published_at": "2024-01-01T12:00:00Z",
    "description": "Article description",
    "comments_count": 8,
    "positive_reactions_count": 42,
    "tags": ["javascript", "tutorial"],
    "id": "article_id",
    "comments": [
      {
        "id": "comment_id",
        "body": "Comment content",
        "author": "commenter",
        "created_at": "2024-01-01T13:00:00Z",
        "positive_reactions_count": 3,
        "children": [
          {
            "id": "nested_comment_id",
            "body": "Nested reply",
            "author": "replier",
            "created_at": "2024-01-01T14:00:00Z",
            "positive_reactions_count": 1,
            "children": []
          }
        ]
      }
    ]
  }
]
```

### 3. X.com (Twitter) API - Search Tweets

Search tweets and fetch replies with engagement metrics.

**Endpoint:** `GET /api/x.com`

**Parameters:**
- `query` (required): Search term for tweets
- `queryType` (optional): Type of search - "Latest", "Top", etc. (default: "Latest")
- `limit` (optional): Number of tweets to fetch (default: 500)

**Example Requests:**
```bash
# Search for AI tweets
GET http://localhost:3000/api/x.com?query=artificial%20intelligence&limit=10

# Search with specific query type
GET http://localhost:3000/api/x.com?query=nextjs&queryType=Top&limit=20

# Search programming tweets
GET http://localhost:3000/api/x.com?query=programming&limit=15
```

**Response Format:**
```json
[
  {
    "url": "https://twitter.com/user/status/123456789",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "id": "123456789",
    "text": "Tweet content here...",
    "retweetCount": 15,
    "replyCount": 8,
    "likeCount": 42,
    "comments": [
      {
        "text": "Reply content...",
        "likeCount": 5,
        "replyCount": 2
      }
    ]
  }
]
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing required parameters)
- `500`: Internal Server Error (API failures, missing credentials)

Error responses follow this format:
```json
{
  "error": "Error description"
}
```

## Features

- **Nested Comments**: All platforms support hierarchical comment structures
- **Language Filtering**: X.com and other platforms filter for English content
- **Rate Limiting**: Built-in error handling for API rate limits
- **Async Processing**: Efficient concurrent processing for multiple requests

## Dependencies

The project uses these main dependencies:
- Next.js 15.3.4
- axios for HTTP requests
- Built-in Node.js APIs for environment variables

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
