// Local storage utilities for offline data persistence

export const storage = {
  // Crop Disease History
  saveDiseaseDetection: (data: any) => {
    const history = storage.getDiseaseHistory();
    history.unshift({ ...data, timestamp: Date.now() });
    localStorage.setItem('disease_history', JSON.stringify(history.slice(0, 50)));
  },
  
  getDiseaseHistory: () => {
    const data = localStorage.getItem('disease_history');
    return data ? JSON.parse(data) : [];
  },

  // Crop Monitoring
  saveMonitoringData: (data: any) => {
    const monitoring = storage.getMonitoringData();
    monitoring.unshift({ ...data, timestamp: Date.now() });
    localStorage.setItem('monitoring_data', JSON.stringify(monitoring.slice(0, 100)));
  },

  getMonitoringData: () => {
    const data = localStorage.getItem('monitoring_data');
    return data ? JSON.parse(data) : [];
  },

  // Community Posts
  saveCommunityPost: (post: any) => {
    const posts = storage.getCommunityPosts();
    const newPost = {
      ...post,
      id: Date.now().toString(),
      timestamp: Date.now(),
      likes: 0,
      comments: []
    };
    posts.unshift(newPost);
    localStorage.setItem('community_posts', JSON.stringify(posts));
    return newPost;
  },

  getCommunityPosts: () => {
    const data = localStorage.getItem('community_posts');
    return data ? JSON.parse(data) : [];
  },

  addComment: (postId: string, comment: any) => {
    const posts = storage.getCommunityPosts();
    const post = posts.find((p: any) => p.id === postId);
    if (post) {
      post.comments.push({
        ...comment,
        id: Date.now().toString(),
        timestamp: Date.now()
      });
      localStorage.setItem('community_posts', JSON.stringify(posts));
    }
  },

  likePost: (postId: string) => {
    const posts = storage.getCommunityPosts();
    const post = posts.find((p: any) => p.id === postId);
    if (post) {
      post.likes += 1;
      localStorage.setItem('community_posts', JSON.stringify(posts));
    }
  },

  // Weather Data
  saveWeatherData: (data: any) => {
    localStorage.setItem('weather_data', JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  },

  getWeatherData: () => {
    const data = localStorage.getItem('weather_data');
    return data ? JSON.parse(data) : null;
  },

  // User Preferences
  saveUserProfile: (profile: any) => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  },

  getUserProfile: () => {
    const data = localStorage.getItem('user_profile');
    return data ? JSON.parse(data) : {
      name: 'Farmer',
      location: 'India',
      landArea: 5,
      preferredCrop: 'wheat'
    };
  }
};
