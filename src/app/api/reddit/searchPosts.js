import axios from 'axios';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get('keyword');

    if (!keyword) {
      console.error('Keyword is missing in the query parameters');
      return new Response(JSON.stringify({ error: 'Keyword is required' }), {
        status: 400,
      });
    }

    const redditClientId = process.env.REDDIT_CLIENT_ID;
    const redditClientSecret = process.env.REDDIT_CLIENT_SECRET;
    const redditAppName = process.env.REDDIT_APP_NAME;
    const redditUsername = process.env.REDDIT_USERNAME;

    if (!redditClientId || !redditClientSecret || !redditAppName || !redditUsername) {
      console.error('Missing Reddit API credentials:', {
        redditClientId,
        redditClientSecret,
        redditAppName,
        redditUsername,
      });
      return new Response(JSON.stringify({ error: 'Missing Reddit API credentials' }), {
        status: 500,
      });
    }

    const userAgent = `${redditAppName} by ${redditUsername}`;

    let tokenResponse;
    try {
      tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token', 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${Buffer.from(`${redditClientId}:${redditClientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': userAgent,
        },
      });
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('invalid_client')) {
        console.error('Reddit credentials have expired or are invalid:', errorMessage);
        return new Response(JSON.stringify({ error: 'Reddit credentials have expired or are invalid. Please update them.' }), {
          status: 500,
        });
      }
      console.error('Error fetching Reddit access token:', errorMessage);
      return new Response(JSON.stringify({ error: 'Failed to get Reddit access token' }), {
        status: 500,
      });
    }

    const accessToken = tokenResponse.data.access_token;

    let searchResponse;
    try {
      const searchUrl = `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=5`;
      searchResponse = await axios.get(searchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': userAgent,
        },
      });
    } catch (error) {
      console.error('Error fetching Reddit posts:', error.response?.data || error.message);
      return new Response(JSON.stringify({ error: 'Failed to fetch Reddit posts' }), {
        status: 500,
      });
    }

    const posts = searchResponse.data.data.children.map((post) => {
      const { selftext, title, permalink, num_comments, score } = post.data;
      return {
        body: selftext || title,
        url: `https://www.reddit.com${permalink}`,
        post_comments: num_comments,
        post_like: score,
      };
    });

    console.log('Fetched posts successfully:', posts);

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}