export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  has_issues: boolean;
  open_issues_count: number;
}

export interface SearchFilters {
  query: string;
  language: string;
  sort: 'stars' | 'forks' | 'updated' | 'created';
  order: 'desc' | 'asc';
  beginnerMode: boolean;
}

export interface User {
  id: string;
<<<<<<< HEAD
<<<<<<< HEAD
=======
  /**
   * The user's GitHub username (login). Optional for backward compatibility.
   */
>>>>>>> 89f5a0d (Initial commit)
=======
  /**
   * The user's GitHub username (login). Optional for backward compatibility.
   */
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
  login: string;
  name: string;
  avatar_url: string;
  email?: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  estimatedTime: string;
  features: string[];
}

export interface SubmittedRepo {
  id?: string;
  github_url: string;
  description: string;
  tech_stack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  submitted_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
<<<<<<< HEAD
<<<<<<< HEAD
=======
  owner_avatar?: string;
>>>>>>> 89f5a0d (Initial commit)
=======
  owner_avatar?: string;
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
}