import axios from 'axios';

// Function to organize comments into nested structure
function organizeComments(comments) {
  const commentMap = new Map();
  const rootComments = [];

  // First pass: create comment objects and map them by ID
  comments.forEach(comment => {
    const commentObj = {
      id: comment.id_code,
      body: comment.body_html || comment.body_markdown || '',
      author: comment.user?.username || 'Unknown',
      created_at: comment.created_at,
      positive_reactions_count: comment.positive_reactions_count || 0,
      children: []
    };
    commentMap.set(comment.id_code, commentObj);
  });

  // Second pass: organize into parent-child relationships
  comments.forEach(comment => {
    const commentObj = commentMap.get(comment.id_code);
    
    if (comment.parent && commentMap.has(comment.parent.id_code)) {
      // This is a nested comment
      const parentComment = commentMap.get(comment.parent.id_code);
      parentComment.children.push(commentObj);
    } else {
      // This is a root comment
      rootComments.push(commentObj);
    }
  });

  return rootComments;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || 10;
    const keyword = url.searchParams.get('keyword');
    const tag = url.searchParams.get('tag');

    let response;
    
    // If keyword is provided, use Dev.to search API
    if (keyword) {
      const searchUrl = `https://dev.to/search/feed_content?per_page=${limit}&page=0&search_fields=title&approved=&class_name=Article&sort_by=hotness_score&sort_direction=desc&tag_names%5B%5D=&tag_boolean_mode=all&user_id=&published_at%5Bgte%5D=&published_at%5Blte%5D=&q=${encodeURIComponent(keyword)}`;
      response = await axios.get(searchUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'DevToFetcher/1.0',
        },
      });
    } else {
      // Build the Dev.to API URL with search parameters
      let devToUrl = `https://dev.to/api/articles?per_page=${limit}`;
      
      // Add tag filter if provided
      if (tag) {
        devToUrl += `&tag=${encodeURIComponent(tag)}`;
      }

      response = await axios.get(devToUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'DevToFetcher/1.0',
        },
      });
    }

    let posts;
    
    // Handle different response structures based on search vs regular API
    if (keyword && response.data.result) {
      // Search API response structure
      posts = await Promise.all(response.data.result.map(async (post) => {
        const postData = {
          title: post.title,
          url: post.path ? `https://dev.to${post.path}` : post.url,
          author: post.user?.username || 'Unknown',
          published_at: post.published_at,
          description: post.description || '',
          comments_count: post.comments_count || 0,
          positive_reactions_count: post.public_reactions_count || 0,
          tags: post.tag_list || [],
          id: post.id,
          comments: []
        };

        // Fetch comments if comments_count > 1
        if (postData.comments_count > 1 && post.id) {
          try {
            const commentsResponse = await axios.get(`https://dev.to/api/comments?a_id=${post.id}`, {
              headers: {
                Accept: 'application/json',
                'User-Agent': 'DevToFetcher/1.0',
              },
            });
            postData.comments = organizeComments(commentsResponse.data);
          } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
          }
        }

        return postData;
      }));
    } else {
      // Regular API response structure
      posts = await Promise.all(response.data.map(async (post) => {
        const postData = {
          title: post.title,
          url: post.url,
          author: post.user?.username || 'Unknown',
          published_at: post.published_at,
          description: post.description || '',
          comments_count: post.comments_count || 0,
          positive_reactions_count: post.positive_reactions_count || 0,
          tags: post.tag_list || [],
          id: post.id,
          comments: []
        };

        // Fetch comments if comments_count > 1
        if (postData.comments_count > 1 && post.id) {
          try {
            const commentsResponse = await axios.get(`https://dev.to/api/comments?a_id=${post.id}`, {
              headers: {
                Accept: 'application/json',
                'User-Agent': 'DevToFetcher/1.0',
              },
            });
            postData.comments = organizeComments(commentsResponse.data);
          } catch (error) {
            console.error(`Error fetching comments for post ${post.id}:`, error);
          }
        }

        return postData;
      }));
    }

    // Additional client-side filtering if needed
    if (keyword && !response.data.result) {
      const searchKeyword = keyword.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchKeyword) ||
        (post.description && post.description.toLowerCase().includes(searchKeyword)) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchKeyword))
      );
    }

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Dev.to posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Dev.to posts' }), {
      status: 500,
    });
  }
}