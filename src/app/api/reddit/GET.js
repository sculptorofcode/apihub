import { GET } from './searchPosts';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const response = await GET(req);
    const data = await response.json();
    res.status(response.status).json(data);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}