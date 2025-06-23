import { Repository, SearchFilters } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
  private async fetchWithAuth(url: string) {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitLink-Hub/1.0',
    };

    // Add GitHub token if available (for higher rate limits)
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token && token.length > 0 && token !== 'your_github_token_here') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        if (response.status === 403) {
          const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
          const rateLimitReset = response.headers.get('X-RateLimit-Reset');
          
          if (rateLimitRemaining === '0') {
            const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'unknown';
            throw new Error(`GitHub API rate limit exceeded. Rate limit resets at ${resetTime}. Consider adding a GitHub token to your .env file for higher limits.`);
          }
          throw new Error('GitHub API access forbidden. Please check your token permissions.');
        }
        if (response.status === 401) {
          throw new Error('GitHub API authentication failed. Please check your token in the .env file.');
        }
        throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to GitHub API. Please check your internet connection.');
      }
      throw error;
    }
  }

  async searchRepositories(filters: SearchFilters, page = 1, perPage = 30): Promise<{ items: Repository[]; total_count: number }> {
    let query = filters.query || 'stars:>1';
    
    // Add language filter
    if (filters.language && filters.language !== 'all') {
      query += ` language:${filters.language}`;
    }

    // Enhanced beginner-friendly filters
    if (filters.beginnerMode) {
      query += ' (topic:beginner OR topic:good-first-issue OR topic:hacktoberfest OR topic:education OR topic:learning OR topic:tutorial OR topic:student OR topic:awesome OR topic:resources OR topic:guide OR topic:course OR topic:workshop OR topic:bootcamp OR topic:coding OR topic:programming OR label:"good first issue" OR label:"beginner friendly" OR label:"help wanted")';
      // Also prioritize repositories with good documentation
      query += ' (README.md OR documentation OR docs OR wiki)';
      // Filter for repositories with reasonable complexity (not too many stars to be overwhelming)
      query += ' stars:10..10000';
    }

    // Ensure we only get public repositories with good documentation
    query += ' is:public archived:false';

    const params = new URLSearchParams({
      q: query,
      sort: filters.sort,
      order: filters.order,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    try {
      const data = await this.fetchWithAuth(`${GITHUB_API_BASE}/search/repositories?${params}`);
      return {
        items: data.items || [],
        total_count: data.total_count || 0
      };
    } catch (error) {
      console.error('Error searching repositories:', error);
      return { items: [], total_count: 0 };
    }
  }

  async getTrendingRepositories(language = '', since = 'daily'): Promise<Repository[]> {
    // Get repositories created or updated in the last 24 hours for daily updates
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 1); // Last 24 hours
    
    // Multiple queries to get diverse trending content updated daily
    const queries = [
      // Recently updated popular repositories
      `pushed:>${dateThreshold.toISOString().split('T')[0]} stars:>100`,
      // New repositories gaining traction
      `created:>${dateThreshold.toISOString().split('T')[0]} stars:>10`,
      // Educational content updated recently
      `pushed:>${dateThreshold.toISOString().split('T')[0]} (topic:education OR topic:learning OR topic:tutorial) stars:>20`,
      // Beginner-friendly projects with recent activity
      `pushed:>${dateThreshold.toISOString().split('T')[0]} (topic:beginner OR topic:good-first-issue) stars:>5`,
      // Awesome lists and resources updated recently
      `pushed:>${dateThreshold.toISOString().split('T')[0]} (topic:awesome OR topic:resources) stars:>50`
    ];

    const allRepos: Repository[] = [];

    for (const baseQuery of queries) {
      try {
        let query = baseQuery;
        
        if (language) {
          query += ` language:${language}`;
        }

        query += ' is:public archived:false';

        const params = new URLSearchParams({
          q: query,
          sort: 'updated', // Sort by most recently updated for daily freshness
          order: 'desc',
          per_page: '10',
        });

        const data = await this.fetchWithAuth(`${GITHUB_API_BASE}/search/repositories?${params}`);
        if (data.items) {
          allRepos.push(...data.items);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching trending repositories for query "${baseQuery}":`, error);
        continue;
      }
    }

    // Remove duplicates and return top repositories
    const uniqueRepos = allRepos.filter((repo, index, self) => 
      index === self.findIndex(r => r.id === repo.id)
    );

    // Sort by a combination of recent activity and popularity
    return uniqueRepos
      .sort((a, b) => {
        const aScore = new Date(a.updated_at).getTime() + (a.stargazers_count * 1000);
        const bScore = new Date(b.updated_at).getTime() + (b.stargazers_count * 1000);
        return bScore - aScore;
      })
      .slice(0, 12);
  }

  async getEducationalRepositories(): Promise<Repository[]> {
    // Get educational repositories updated in the last 24 hours
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 1);

    const queries = [
      // Educational content updated recently
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:education stars:>20`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:learning stars:>15`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:tutorial stars:>25`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:course stars:>10`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:bootcamp stars:>5`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:programming stars:>30`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:coding stars:>20`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:student stars:>10`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:beginner stars:>15`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:awesome stars:>100`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:resources stars:>25`,
      `pushed:>${dateThreshold.toISOString().split('T')[0]} topic:guide stars:>15`,
      // Also include highly starred educational repos (fallback)
      'topic:education stars:>500',
      'topic:learning stars:>300',
      'topic:tutorial stars:>400'
    ];

    const allRepos: Repository[] = [];

    for (const query of queries) {
      try {
        const params = new URLSearchParams({
          q: `${query} is:public archived:false`,
          sort: 'updated', // Prioritize recently updated content
          order: 'desc',
          per_page: '8',
        });

        const data = await this.fetchWithAuth(`${GITHUB_API_BASE}/search/repositories?${params}`);
        if (data.items) {
          allRepos.push(...data.items);
        }
        
        // Add a small delay between requests to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        console.error(`Error fetching repositories for query "${query}":`, error);
        // Continue with other queries even if one fails
        continue;
      }
    }

    // Remove duplicates and return top repositories
    const uniqueRepos = allRepos.filter((repo, index, self) => 
      index === self.findIndex(r => r.id === repo.id)
    );

    // Sort by a combination of recent updates and educational value
    return uniqueRepos
      .sort((a, b) => {
        // Calculate score based on recent activity and stars
        const aScore = new Date(a.updated_at).getTime() + (a.stargazers_count * 100);
        const bScore = new Date(b.updated_at).getTime() + (b.stargazers_count * 100);
        return bScore - aScore;
      })
      .slice(0, 20);
  }

  private async getFallbackEducationalRepos(): Promise<Repository[]> {
    // Fallback list of well-known educational repositories
    const fallbackRepos = [
      'freeCodeCamp/freeCodeCamp',
      'EbookFoundation/free-programming-books',
      'jwasham/coding-interview-university',
      'kamranahmedse/developer-roadmap',
      'public-apis/public-apis',
      'sindresorhus/awesome',
      'trekhleb/javascript-algorithms',
      'TheAlgorithms/Python',
      'microsoft/Web-Dev-For-Beginners',
      'microsoft/ML-For-Beginners',
      'ossu/computer-science',
      'donnemartin/system-design-primer',
      'getify/You-Dont-Know-JS',
      'airbnb/javascript',
      'ryanmcdermott/clean-code-javascript'
    ];

    const repos: Repository[] = [];
    
    for (const repoPath of fallbackRepos) {
      try {
        const repo = await this.getRepositoryDetails(repoPath.split('/')[0], repoPath.split('/')[1]);
        repos.push(repo);
        
        // Add a small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching fallback repo ${repoPath}:`, error);
        // Continue with other repos even if one fails
        continue;
      }
    }

    return repos;
  }

  async getRepositoryDetails(owner: string, repo: string): Promise<Repository> {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  }

  async getUserRepositories(username: string): Promise<Repository[]> {
    try {
      const data = await this.fetchWithAuth(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=30&type=public`);
      return data || [];
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      return [];
    }
  }

  async getPopularLanguages(): Promise<string[]> {
    // Return popular programming languages for filtering
    return [
      'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'php', 
      'ruby', 'swift', 'kotlin', 'dart', 'c', 'cpp', 'csharp', 'html', 
      'css', 'vue', 'react', 'angular', 'nodejs', 'express', 'django', 
      'flask', 'spring', 'laravel', 'rails'
    ];
  }
}

export const githubService = new GitHubService();