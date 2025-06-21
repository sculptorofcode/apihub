import axios from 'axios';
import { rankKeywords } from '../keyword-suggestions/rankKeywords';

// Function to fetch replies to a specific tweet using TwitterAPI.io
async function fetchTweetReplies(apiKey, tweetId, limit = 200) {
  try {
    const url = 'https://api.twitterapi.io/twitter/tweet/replies';
    const params = {
      tweetId: tweetId,
      limit: limit
    };

    const response = await axios.get(url, {
      params: params,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    if (!data.tweets) {
      return [];
    }

    const comments = [];
    data.tweets.forEach(reply => {
      if (reply.lang && reply.lang.toLowerCase() === 'en') {
        comments.push({
          text: reply.text,
          likeCount: reply.likeCount,
          replyCount: reply.replyCount
        });
      }
    });

    return comments;
  } catch (error) {
    console.error('Error fetching tweet replies:', error);
    return [];
  }
}

// Function to fetch tweets from TwitterAPI.io using advanced search
async function fetchTweets(apiKey, query, queryType = 'Latest', limit = 500) {
  try {
    const url = 'https://api.twitterapi.io/twitter/tweet/advanced_search';
    const params = {
      query: query,
      limit: limit,
      queryType: queryType
    };

    const response = await axios.get(url, {
      params: params,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
}

// Function to clean and extract relevant fields from tweets
async function formatTweets(tweets, apiKey) {
  const filtered = [];

  if (!tweets.tweets) {
    return filtered;
  }

  for (const tweet of tweets.tweets) {
    if (tweet.lang && tweet.lang.toLowerCase() === 'en') {
      let comments = [];
      
      // Fetch comments if replyCount > 0
      if (tweet.replyCount > 0) {
        comments = await fetchTweetReplies(apiKey, tweet.id);
      }

      filtered.push({
        url: tweet.url,
        createdAt: tweet.createdAt,
        id: tweet.id,
        text: tweet.text,
        retweetCount: tweet.retweetCount,
        replyCount: tweet.replyCount,
        likeCount: tweet.likeCount,
        comments: comments
      });
    }
  }

  return filtered;
}

// Example usage of rankKeywords
async function processKeywords(keywords) {
  const rankedKeywords = rankKeywords(keywords);
  console.log('Ranked Keywords:', rankedKeywords);
  return rankedKeywords;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const queryType = url.searchParams.get('queryType') || 'Latest';
    const limit = parseInt(url.searchParams.get('limit')) || 500;

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.X_API_KEY;

    if (!apiKey) {
      console.error('Missing X_API_KEY in environment variables');
      return new Response(JSON.stringify({ error: 'Missing API_KEY' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch tweets
    const response = await fetchTweets(apiKey, query, queryType, limit);
    
    // Format tweets with comments
    const filteredTweets = await formatTweets(response, apiKey);

    return new Response(JSON.stringify(filteredTweets), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in X.com API route:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tweets' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function processAndRankKeywords(req) {
  try {
    const keywords = req.body.keywords;

    if (!keywords || !Array.isArray(keywords)) {
      return new Response(JSON.stringify({ error: 'Invalid keywords data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const rankedKeywords = rankKeywords(keywords);

    return new Response(JSON.stringify({ rankedKeywords }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing and ranking keywords:', error);
    return new Response(JSON.stringify({ error: 'Failed to process keywords' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}