// src/services/aiService.ts

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

const titles = [
  'AI-Powered Study Buddy',
  'Virtual Event Platform',
  'Fitness Tracker with Gamification',
  'Personalized News Aggregator',
  'Remote Team Collaboration Tool',
  'Eco-Friendly Shopping Assistant',
  'Language Learning Chatbot',
  'Mental Health Journal',
  'Crowdsourced Travel Guide',
  'Recipe Generator from Fridge Items',
  'Habit Tracker with AI Insights',
  'Open Source Resume Builder',
  'Pet Adoption Finder',
  'Smart Home Dashboard',
  'Online Debate Platform',
  'Interactive Coding Playground',
  'Book Recommendation Engine',
  'Local Community Marketplace',
  'Virtual Art Gallery',
  'AI-Generated Music Mixer'
];

const descriptions = [
  'A web app that helps users ...',
  'A platform to connect ...',
  'An AI-driven tool for ...',
  'A mobile app that tracks ...',
  'A dashboard for managing ...',
  'A chatbot that assists with ...',
  'A service that recommends ...',
  'A tool for organizing ...',
  'A site for sharing ...',
  'A generator for ...'
];

const techs = [
  ['React', 'Node.js', 'MongoDB'],
  ['Vue', 'Firebase'],
  ['Python', 'Flask', 'PostgreSQL'],
  ['Next.js', 'TypeScript'],
  ['React Native', 'Expo'],
  ['Angular', 'Express'],
  ['Svelte', 'Supabase'],
  ['Django', 'AI'],
  ['Gatsby', 'GraphQL'],
  ['Flutter', 'Firebase']
];

const featuresList = [
  ['User authentication', 'Real-time updates', 'Notifications'],
  ['Data visualization', 'Export to CSV', 'Mobile friendly'],
  ['AI recommendations', 'Personalized dashboard', 'Dark mode'],
  ['Gamification', 'Progress tracking', 'Leaderboards'],
  ['API integration', 'Offline support', 'Multi-language']
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const times = ['1-2 days', '3-5 days', '1 week', '2-3 weeks', '1 month'];

export async function fetchAIProjectIdeas(count: number = 3): Promise<any[]> {
  const ideas = Array.from({ length: count }).map(() => {
    const title = getRandomElement(titles) + ' ' + randomString(3);
    return {
      id: 'ai-' + Date.now() + '-' + randomString(4),
      title,
      description: getRandomElement(descriptions),
      difficulty: getRandomElement(difficulties),
      technologies: getRandomElement(techs),
      estimatedTime: getRandomElement(times),
      features: getRandomElement(featuresList)
    };
  });
  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(ideas), 1200));
}
