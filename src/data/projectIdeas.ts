import { ProjectIdea } from '../types';

export const projectIdeas: ProjectIdea[] = [
  {
    id: '1',
    title: 'Todo List App',
    description: 'A simple task management application with add, edit, delete, and mark complete functionality.',
    difficulty: 'Beginner',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    estimatedTime: '1-2 days',
    features: [
      'Add new tasks',
      'Mark tasks as complete',
      'Delete tasks',
      'Filter by status',
      'Local storage persistence'
    ]
  },
  {
    id: '2',
    title: 'Weather App',
    description: 'Display current weather and 5-day forecast using a weather API.',
    difficulty: 'Beginner',
    technologies: ['HTML', 'CSS', 'JavaScript', 'API Integration'],
    estimatedTime: '2-3 days',
    features: [
      'Current weather display',
      'Search by city',
      '5-day forecast',
      'Weather icons',
      'Responsive design'
    ]
  },
  {
    id: '3',
    title: 'Calculator App',
    description: 'A functional calculator with basic arithmetic operations and a clean interface.',
    difficulty: 'Beginner',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    estimatedTime: '1 day',
    features: [
      'Basic arithmetic operations',
      'Clear and delete functions',
      'Keyboard support',
      'Memory functions',
      'Responsive design'
    ]
  },
  {
    id: '4',
    title: 'Personal Portfolio Website',
    description: 'Showcase your projects, skills, and experience with a professional portfolio.',
    difficulty: 'Beginner',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    estimatedTime: '3-5 days',
    features: [
      'About me section',
      'Projects showcase',
      'Skills and experience',
      'Contact form',
      'Responsive design'
    ]
  },
  {
    id: '5',
    title: 'Quiz Application',
    description: 'Interactive quiz app with multiple choice questions and score tracking.',
    difficulty: 'Intermediate',
    technologies: ['React', 'JavaScript', 'CSS', 'JSON'],
    estimatedTime: '3-4 days',
    features: [
      'Multiple choice questions',
      'Score tracking',
      'Timer functionality',
      'Results summary',
      'Question categories'
    ]
  },
  {
    id: '6',
    title: 'Recipe Finder',
    description: 'Search and discover recipes using a food API with ingredients and instructions.',
    difficulty: 'Intermediate',
    technologies: ['React', 'API Integration', 'CSS', 'JavaScript'],
    estimatedTime: '4-5 days',
    features: [
      'Recipe search',
      'Ingredient lists',
      'Cooking instructions',
      'Nutritional information',
      'Favorite recipes'
    ]
  },
  {
    id: '7',
    title: 'Expense Tracker',
    description: 'Track income and expenses with categories, charts, and budget management.',
    difficulty: 'Intermediate',
    technologies: ['React', 'Charts.js', 'Local Storage', 'CSS'],
    estimatedTime: '5-7 days',
    features: [
      'Add income/expenses',
      'Category management',
      'Visual charts',
      'Budget tracking',
      'Export data'
    ]
  },
  {
    id: '8',
    title: 'Chat Application',
    description: 'Real-time chat app with multiple rooms and user authentication.',
    difficulty: 'Advanced',
    technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
    estimatedTime: '1-2 weeks',
    features: [
      'Real-time messaging',
      'Multiple chat rooms',
      'User authentication',
      'File sharing',
      'Online status'
    ]
  }
];