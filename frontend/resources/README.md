
# IdeaHub Mock Data Resources

This folder contains realistic dummy data for the IdeaHub platform development. All JSON files are structured to work together with consistent IDs and relationships.

## Files Overview

### 📄 users.json
Contains 10 user profiles with:
- Personal information (name, email, bio)
- Profile pictures from Unsplash
- Social connections (followers/following)
- Reputation scores and locations

### 📄 posts.json
Contains 10 detailed idea posts with:
- Rich content and descriptions
- Author relationships (linked to users.json)
- Categories and tags
- Engagement metrics (likes, comments, bookmarks)
- Publication status and featured flags

### 📄 comments.json
Contains 12 comments across various posts with:
- Threaded replies structure
- Author relationships
- Engagement metrics
- Real discussion content

### 📄 conversations.json
Contains 5 private conversations between users with:
- Message threads
- Read/unread status
- Participant information
- Message timestamps

### 📄 categories.json
Contains 10 platform categories with:
- Category metadata (name, description, icon)
- Color schemes for UI
- Post count statistics

### 📄 notifications.json
Contains 12 user notifications with:
- Various notification types (likes, comments, follows, messages)
- Read/unread status
- Related entity references
- User action tracking

### 📄 groups.json
Contains 6 community groups with:
- Group metadata and descriptions
- Member and post counts
- Admin and moderator roles
- Privacy settings

## Data Relationships

- **posts.authorId** → **users.id**
- **comments.postId** → **posts.id**
- **comments.authorId** → **users.id**
- **conversations.participantIds** → **users.id**
- **notifications.userId** → **users.id**
- **notifications.actionUserId** → **users.id**
- **posts.category** → **categories.id**
- **groups.adminIds/moderatorIds** → **users.id**

## Usage Examples

```javascript
// Import data in your components
import users from './resources/users.json';
import posts from './resources/posts.json';
import comments from './resources/comments.json';

// Find user by ID
const getUser = (userId) => users.find(user => user.id === userId);

// Get posts by author
const getPostsByAuthor = (authorId) => posts.filter(post => post.authorId === authorId);

// Get comments for a post
const getCommentsForPost = (postId) => comments.filter(comment => comment.postId === postId);
```

## Image Sources

All profile pictures and images use Unsplash URLs for consistency and quality. These are placeholder images suitable for development and testing.

## Notes

- All timestamps are in ISO 8601 format
- IDs use descriptive prefixes (user-, post-, comment-, etc.)
- Data includes realistic engagement numbers and content
- Privacy settings and permissions are included where relevant
- Content is diverse and represents various tech categories
