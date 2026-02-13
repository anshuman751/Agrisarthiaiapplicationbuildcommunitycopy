// Initialize app with sample data for better UX

export const initializeSampleData = () => {
  // Check if already initialized
  if (localStorage.getItem('app_initialized')) {
    return;
  }

  // Sample community posts
  const samplePosts = [
    {
      id: '1',
      author: 'Rajesh Kumar',
      title: 'Great Wheat Harvest This Year!',
      content: 'Just completed my wheat harvest and the yield exceeded expectations! Used drip irrigation and organic fertilizers as recommended by soil testing. Got 32 quintals per hectare. Thanks to modern farming techniques!',
      image: null,
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
      likes: 15,
      comments: [
        {
          id: 'c1',
          author: 'Priya Sharma',
          text: 'Congratulations! Which variety did you use?',
          timestamp: Date.now() - 86400000
        },
        {
          id: 'c2',
          author: 'Amit Patel',
          text: 'Excellent results! Can you share your fertilization schedule?',
          timestamp: Date.now() - 43200000
        }
      ]
    },
    {
      id: '2',
      author: 'Sunita Devi',
      title: 'Tomato Disease - Need Help',
      content: 'I noticed some brown spots on my tomato leaves. Has anyone experienced this? The spots have dark rings around them. Crop is 45 days old. Please suggest remedies.',
      image: null,
      timestamp: Date.now() - 86400000, // 1 day ago
      likes: 8,
      comments: [
        {
          id: 'c3',
          author: 'Dr. Mehta',
          text: 'Sounds like Early Blight. Remove affected leaves and apply copper-based fungicide. Also check the AI Disease Detection feature in this app!',
          timestamp: Date.now() - 43200000
        }
      ]
    },
    {
      id: '3',
      author: 'Vikram Singh',
      title: 'PM-KISAN Payment Received',
      content: 'Just received the latest PM-KISAN installment of ₹2000. Great initiative by the government to support farmers. Make sure you all check your eligibility using the Government Schemes feature.',
      image: null,
      timestamp: Date.now() - 43200000, // 12 hours ago
      likes: 23,
      comments: [
        {
          id: 'c4',
          author: 'Kavita Reddy',
          text: 'Yes! Very helpful scheme. Applied last year and getting regular payments.',
          timestamp: Date.now() - 21600000
        }
      ]
    },
    {
      id: '4',
      author: 'Harish Chandra',
      title: 'Soil Testing Results - Excellent!',
      content: 'Got my soil test results today. Fertility score is 85%! All thanks to using compost and vermicompost regularly. The Soil Intelligence tool here gives great recommendations.',
      image: null,
      timestamp: Date.now() - 21600000, // 6 hours ago
      likes: 12,
      comments: []
    },
    {
      id: '5',
      author: 'Meena Kumari',
      title: 'Drip Irrigation Success Story',
      content: 'Installed drip irrigation system this season with subsidy from PMKSY scheme. Water usage reduced by 40% and yield increased by 25%. Highly recommend to all farmers! The irrigation calculator on this app is very accurate.',
      image: null,
      timestamp: Date.now() - 10800000, // 3 hours ago
      likes: 31,
      comments: [
        {
          id: 'c5',
          author: 'Ramesh Yadav',
          text: 'That\'s amazing! How much was the total cost after subsidy?',
          timestamp: Date.now() - 7200000
        },
        {
          id: 'c6',
          author: 'Anjali Deshmukh',
          text: 'I\'m planning to install too. Did you face any technical issues?',
          timestamp: Date.now() - 3600000
        }
      ]
    }
  ];

  localStorage.setItem('community_posts', JSON.stringify(samplePosts));

  // Sample user profile
  const userProfile = {
    name: 'Farmer',
    location: 'India',
    landArea: 5,
    preferredCrop: 'wheat'
  };
  localStorage.setItem('user_profile', JSON.stringify(userProfile));

  // Mark as initialized
  localStorage.setItem('app_initialized', 'true');
};
