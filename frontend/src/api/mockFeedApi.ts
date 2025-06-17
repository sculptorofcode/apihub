
import { Post } from '../components/postcard/types';

export interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
  nextPage: number;
}

// Mock API function - replace with your actual API call
export const fetchFeedPosts = async (page: number): Promise<FeedResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const POSTS_PER_PAGE = 10;
  const mockPosts: Post[] = Array.from({ length: POSTS_PER_PAGE }, (_, i) => {
    const postIndex = page * POSTS_PER_PAGE + i;
    // Variety assignment
    let mediaContent = null;
    let type: 'text' | 'image' | 'video';
    if (i % 5 === 2 || i % 5 === 3 || i % 5 === 6 || i % 5 === 7) {
      type = 'image';
      const imageIds = [
        'photo-1649972904349-6e44c42644a7',
        'photo-1488590528505-98d2b5aba04b',
        'photo-1518770660439-4636190af475',
        'photo-1461749280684-dccba630e2f6',
        'photo-1519389950473-47ba0277781c',
        'photo-1498050108023-c5249f4df085',
        'photo-1472396961693-142e6e269027',
        'photo-1506744038136-46273834b3fb',
        'photo-1488972685288-c3fd157d7c7a',
        'photo-1497604401993-f2e922e5cb0a'
      ];
      mediaContent = {
        type: 'image' as const,
        url: `https://images.unsplash.com/${imageIds[(postIndex + i) % imageIds.length]}?w=600&h=400&fit=crop`,
        alt: `Innovation concept ${postIndex + 1}`
      };
    } else if (i % 5 === 4) {
      type = 'video';
      mediaContent = {
        type: 'video' as const,
        url: `/resources/videos/demo-video-${(postIndex % 5) + 1}.mp4`,
        thumbnail: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=600&h=400&fit=crop`
      };
    } else {
      type = 'text';
    }
    const titles = [
      'AI-Powered Personal Finance Revolution',
      'Sustainable Smart City Initiative',
      'Blockchain Identity Verification System',
      'VR Training Platform for Healthcare',
      'IoT-Enabled Urban Farming Solution',
      'AR Shopping Experience Innovation',
      'Renewable Energy Marketplace',
      'Mental Health AI Companion',
      'Decentralized Social Learning Platform',
      'Smart Waste Management System'
    ];
    const descriptions = [
      'Revolutionizing personal finance with AI that learns your spending patterns and automatically optimizes your budget. This system could transform how people manage money.',
      'Creating sustainable smart cities through IoT sensors and AI-driven resource management. The future of urban living starts with intelligent infrastructure.',
      'Building a decentralized identity system that gives users complete control over their personal data while enabling seamless verification across platforms.',
      'Developing immersive VR training platforms that provide hands-on experience for healthcare professionals without real-world risks.',
      'Transforming urban agriculture with IoT sensors that monitor soil, water, and plant health to maximize yields in small spaces.',
      'Creating augmented reality shopping experiences that bridge the gap between online and offline retail.',
      'Building a marketplace for renewable energy that connects producers with consumers in a decentralized network.',
      'Developing AI companions that provide personalized mental health support and early intervention for stress and anxiety.',
      'Creating a decentralized platform where learners can share knowledge and earn tokens for contributing to educational content.',
      'Implementing smart waste management systems that optimize collection routes and reduce environmental impact.'
    ];
    return {
      id: `post-${page}-${i}`,
      title: titles[(postIndex + i) % titles.length],
      description: descriptions[(postIndex + i) % descriptions.length],
      author: {
        id: `user-${i}`,
        name: [
          'Alex Chen', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
          'Jessica Garcia', 'Ryan Martinez', 'Olivia Thompson', 'James Rodriguez', 'Sophia Anderson'
        ][(postIndex + i) % 10],
        avatar: `https://images.unsplash.com/photo-${1500000000100 + ((postIndex + i) % 50000000)}?w=100&h=100&fit=crop&crop=face`
      },
      tags: [
        ['AI', 'FinTech', 'Innovation'],
        ['Sustainability', 'SmartCity', 'IoT'],
        ['Blockchain', 'Privacy', 'Security'],
        ['VR', 'Healthcare', 'Training'],
        ['IoT', 'Agriculture', 'Sustainability'],
        ['AR', 'Retail', 'Technology'],
        ['Energy', 'Blockchain', 'Environment'],
        ['AI', 'Healthcare', 'MentalHealth'],
        ['Education', 'Blockchain', 'Learning'],
        ['IoT', 'Environment', 'SmartCity']
      ][(postIndex + i) % 10],
      likes: 10 + ((postIndex + i * 17) % 498),
      comments: 2 + ((postIndex + i * 7) % 48),
      bookmarks: 5 + ((postIndex + i * 9) % 95),
      isLiked: ((postIndex + i) % 7) === 0,
      isBookmarked: ((postIndex + i) % 9) === 0,
      createdAt: new Date(Date.now() - ((postIndex + i) * 7938237) % (7 * 24 * 60 * 60 * 1000)).toISOString(),
      media: mediaContent
    };
  });
  const hasMore = page < 5;
  return {
    posts: mockPosts,
    hasMore,
    nextPage: page + 1
  };
};
