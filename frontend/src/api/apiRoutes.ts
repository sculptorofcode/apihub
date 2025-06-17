// API routes definition
export const API_ROUTES = {
  // Auth routes
  auth: {
    login: `/auth/login`,
    register: `/auth/register`,
    forgotPassword: `/auth/forgot-password`,
    resetPassword: `/auth/reset-password`,
    logout: `/auth/logout`,
    verifyEmail: `/auth/email/verify`,
    resendVerificationEmail: `/auth/email/verify/resend`,
    checkUsername: `/auth/check-username`,
  },
  
  // User routes
  user: {
    profile: `/profile`,
    details: `/user`,
  },
  
  // Profile routes
  profile: {
    get: (username: string) => `/profile/${username}`,
    update: `/profile`,
    activity: `/profile/activity`,
  },
  
  // Feed routes
  feed: {
    getPosts: (page: number = 1) => `/feed?page=${page}`,
  },
  
  // Posts routes
  posts: {
    getById: (id: string) => `/posts/${id}`,
    create: `/posts`,
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
    like: (id: string) => `/posts/${id}/like`,
    bookmark: (id: string) => `/posts/${id}/bookmark`,
    comments: (id: string) => `/posts/${id}/comments`,
  },
    // Comments routes
  comments: {
    create: (postId: string) => `/posts/${postId}/comments`,
    update: (commentId: string) => `/comments/${commentId}`,
    delete: (commentId: string) => `/comments/${commentId}`,
    like: (commentId: string) => `/comments/${commentId}/like`,
  },
    // Friends routes
  friends: {
    search: `/friends/search`,
    searchWithParams: (query: string = '', page: number = 1, suggested: boolean = false) => 
      `/friends/search?query=${encodeURIComponent(query)}&page=${page}&suggested=${suggested ? 1 : 0}`,
    sendRequest: `/friends/request`,
    getRequests: `/friends/requests`,
    getRequestsCount: `/friends/requests/count`,
    acceptRequest: (requestId: string) => `/friends/requests/${requestId}/accept`,
    rejectRequest: (requestId: string) => `/friends/requests/${requestId}/reject`,
    getFriends: `/friends`,
    removeFriend: (userId: string) => `/friends/${userId}`,
  },
};