import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { RepositoryCard } from './components/RepositoryCard';
import { ProjectIdeaCard } from './components/ProjectIdeaCard';
import { SubmitRepoForm } from './components/SubmitRepoForm';
import { UserRepoUpload } from './components/UserRepoUpload';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Repository, SearchFilters, ProjectIdea, SubmittedRepo } from './types';
import { githubService } from './services/githubApi';
import { supabase, isSupabaseEnabled } from './lib/supabase';
import { projectIdeas } from './data/projectIdeas';
import { TrendingUp, Sparkles, Code2, BookOpen, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchAIProjectIdeas } from './services/aiService';
import { SubmittedRepoCard } from './components/SubmittedRepoCard';

// Type guard for .eq
function hasEq(obj: any): obj is { eq: Function } {
  return obj && typeof obj.eq === 'function';
}
// Type guard for .order
function hasOrder(obj: any): obj is { order: Function } {
  return obj && typeof obj.order === 'function';
}
// Type guard for Promise-like
function isPromise(obj: any): obj is Promise<any> {
  return obj && typeof obj.then === 'function';
}
// Type guard for .data and .error
function hasDataAndError(obj: any): obj is { data: any; error: any } {
  return obj && typeof obj === 'object' && 'data' in obj && 'error' in obj;
}

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [trendingRepos, setTrendingRepos] = useState<Repository[]>([]);
  const [educationalRepos, setEducationalRepos] = useState<Repository[]>([]);
  const [bookmarkedRepos, setBookmarkedRepos] = useState<Repository[]>([]);
  const [submittedRepos, setSubmittedRepos] = useState<SubmittedRepo[]>([]);
  const [submittedEducationalRepos, setSubmittedEducationalRepos] = useState<Repository[]>([]);
  const [submittedError, setSubmittedError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [educationalLoading, setEducationalLoading] = useState(false);
  const [submittedLoading, setSubmittedLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    language: 'all',
    sort: 'stars',
    order: 'desc',
    beginnerMode: false,
  });
  const [aiIdeas, setAIIdeas] = useState<ProjectIdea[]>([]);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState('');

  useEffect(() => {
    loadTrendingRepositories();
    loadEducationalRepositories();
    if (user && isSupabaseEnabled) {
      loadBookmarks();
      loadSubmittedRepos();
    }
  }, [user]);

  // Auto-refresh repositories every 30 minutes for daily updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentView === 'home' && !hasSearched) {
        loadTrendingRepositories();
        loadEducationalRepositories();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [currentView, hasSearched]);

  const loadTrendingRepositories = async () => {
    setTrendingLoading(true);
    setApiError(null);
    try {
      const trending = await githubService.getTrendingRepositories();
      setTrendingRepos(trending);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading trending repositories:', error);
      if (error instanceof Error && error.message.includes('rate limit')) {
        setApiError('GitHub API rate limit exceeded. Please add a GitHub token to your .env file for higher limits, or try again later.');
      }
    } finally {
      setTrendingLoading(false);
    }
  };

  const loadEducationalRepositories = async () => {
    setEducationalLoading(true);
    setApiError(null);
    try {
      const educational = await githubService.getEducationalRepositories();
      setEducationalRepos(educational);
      setLastUpdated(new Date());

      // Fetch submitted repos from Supabase (no status filter for debug)
      const submittedResult = await supabase
        .from('submitted_repos')
        .select('*');
      let submitted: any[] = [];
      let submittedError: any = null;
      if (submittedResult && typeof submittedResult === 'object') {
        if ('data' in submittedResult) submitted = submittedResult.data || [];
        if ('error' in submittedResult) submittedError = submittedResult.error;
      }
      console.log('Supabase submitted_repos:', submitted, submittedError);
      // Map submitted repos to Repository shape for display
      const mapped = (submitted || []).map((repo: any) => ({
        id: repo.id,
        name: repo.github_url?.split('/').slice(-1)[0] || 'Submitted Repo',
        full_name: repo.github_url?.replace('https://github.com/', '') || repo.github_url,
        description: repo.description,
        html_url: repo.github_url,
        stargazers_count: 0,
        forks_count: 0,
        language: repo.tech_stack?.[0] || null,
        updated_at: repo.created_at || '',
        created_at: repo.created_at || '',
        topics: repo.tech_stack || [],
        owner: { login: repo.submitted_by || 'user', avatar_url: '' },
        has_issues: false,
        open_issues_count: 0,
      }));
      console.log('Mapped submittedEducationalRepos:', mapped);
      setSubmittedEducationalRepos(mapped);
    } catch (error) {
      console.error('Error loading educational repositories:', error);
      if (error instanceof Error && error.message.includes('rate limit')) {
        setApiError('GitHub API rate limit exceeded. Please add a GitHub token to your .env file for higher limits, or try again later.');
      }
    } finally {
      setEducationalLoading(false);
    }
  };

  const loadSubmittedRepos = async () => {
    setSubmittedLoading(true);
    setSubmittedError('');
    try {
      let data: SubmittedRepo[] = [];
      let error: any = null;
      const fromResult = supabase.from('submitted_repos');
      const selectResult = fromResult.select('*');
      if (hasOrder(selectResult)) {
        // Real Supabase
        const resp = await selectResult.order('created_at', { ascending: false });
        if (hasDataAndError(resp)) {
          data = resp.data || [];
          error = resp.error;
        }
      } else if (isPromise(selectResult)) {
        // Mock fallback
        const resp = await selectResult;
        if (hasDataAndError(resp)) {
          data = resp.data || [];
          error = resp.error;
        }
      }
      if (error) throw error;
      setSubmittedRepos(data);
    } catch (err) {
      setSubmittedError(err instanceof Error ? err.message : 'Failed to load submitted repositories.');
    } finally {
      setSubmittedLoading(false);
    }
  };

  const loadBookmarks = async () => {
    if (!user || !isSupabaseEnabled) return;
    try {
      const fromResult = supabase.from('bookmarks');
      const selectResult = fromResult.select('repository_data');
      if (hasEq(selectResult)) {
        // Real Supabase or mock with .eq
        const resp = await selectResult.eq('user_id', user.id);
        if (hasDataAndError(resp)) {
          const data = resp.data;
          const error = resp.error;
          if (error) {
            if (error.message.includes('Supabase not configured')) {
              console.warn('Bookmarks disabled: Supabase not configured');
              return;
            }
            throw error;
          }
          const bookmarks = Array.isArray(data) ? data.map((item: any) => item.repository_data) : [];
          setBookmarkedRepos(bookmarks);
        }
      } else if (isPromise(selectResult)) {
        // If it's a Promise (mock without .eq), just await it
        const resp = await selectResult;
        if (hasDataAndError(resp)) {
          const bookmarks = Array.isArray(resp.data) ? resp.data.map((item: any) => item.repository_data) : [];
          setBookmarkedRepos(bookmarks);
        }
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      // Don't show error to user for bookmarks, just log it
    }
  };

  const searchRepositories = async () => {
    setLoading(true);
    setHasSearched(true);
    setApiError(null);
    
    try {
      const results = await githubService.searchRepositories(filters);
      setRepositories(results.items);
      setTotalCount(results.total_count);
    } catch (error) {
      console.error('Error searching repositories:', error);
      setRepositories([]);
      setTotalCount(0);
      if (error instanceof Error && error.message.includes('rate limit')) {
        setApiError('GitHub API rate limit exceeded. Please add a GitHub token to your .env file for higher limits, or try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (repo: any) => {
    if (!user || !isSupabaseEnabled) return;
    // Optimistically update UI
    const isBookmarked = bookmarkedRepos.some(r => String(r.id) === String(repo.id));
    if (!isBookmarked) {
      setBookmarkedRepos((prev) => [...prev, repo]);
    } else {
      setBookmarkedRepos((prev) => prev.filter(r => String(r.id) !== String(repo.id)));
    }
    try {
      const fromResult = supabase.from('bookmarks');
      const selectResult = fromResult.select('*');
      if (hasEq(selectResult)) {
        const firstResp = await selectResult.eq('repository_id', repo.id);
        let existsResp = firstResp;
        if (hasEq(firstResp)) {
          existsResp = await firstResp.eq('user_id', user.id);
        }
        if (hasDataAndError(existsResp)) {
          if (Array.isArray(existsResp.data) && existsResp.data.length > 0) return; // Already bookmarked
        }
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          repository_id: repo.id,
          repository_data: repo
        });
      } else if (isPromise(selectResult)) {
        const existsResp = await selectResult;
        if (hasDataAndError(existsResp) && Array.isArray(existsResp.data) && existsResp.data.length > 0) return;
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          repository_id: repo.id,
          repository_data: repo
        });
      }
    } catch (error) {
      console.error('Error bookmarking repo:', error);
      // Rollback optimistic update on error
      if (!isBookmarked) {
        setBookmarkedRepos((prev) => prev.filter(r => String(r.id) !== String(repo.id)));
      } else {
        setBookmarkedRepos((prev) => [...prev, repo]);
      }
    }
  };

  const refreshRepositories = () => {
    loadTrendingRepositories();
    loadEducationalRepositories();
  };

  const handleGenerateAIIdeas = async () => {
    setAILoading(true);
    setAIError('');
    try {
      const newIdeas = await fetchAIProjectIdeas(3);
      setAIIdeas((prev) => {
        // Filter out ideas with duplicate id or title
        const existingTitles = new Set([...projectIdeas, ...prev].map(i => i.title));
        const existingIds = new Set([...projectIdeas, ...prev].map(i => i.id));
        return [
          ...prev,
          ...newIdeas.filter(i => !existingTitles.has(i.title) && !existingIds.has(i.id))
        ];
      });
    } catch (err) {
      setAIError('Failed to fetch AI project ideas.');
    } finally {
      setAILoading(false);
    }
  };

  const handleDeleteSubmittedRepo = async (id: string | undefined) => {
    if (!id) return;
    try {
      await supabase.from('submitted_repos').delete().eq('id', id);
      setSubmittedRepos((prev) => prev.filter((repo) => String(repo.id) !== String(id)));
      setSubmittedEducationalRepos((prev) => prev.filter((repo) => String(repo.id) !== String(id)));
    } catch (err) {
      alert('Failed to delete the submitted repository.');
    }
  };

  // Utility to delete submitted repos by name (for admin/debug)
  const deleteSubmittedReposByNames = async (names: string[]) => {
    try {
      for (const name of names) {
        // Find the repo in submittedEducationalRepos by name
        const repo = submittedEducationalRepos.find(r => r.name === name);
        if (repo) {
          await supabase.from('submitted_repos').delete().eq('id', repo.id);
          setSubmittedEducationalRepos(prev => prev.filter(r => r.id !== repo.id));
        }
      }
      // Also update submittedRepos in case it's used elsewhere (match by github_url)
      setSubmittedRepos(prev => prev.filter(r => !names.includes(r.github_url?.split('/').slice(-1)[0])));
    } catch (err) {
      alert('Failed to delete one or more submitted repositories.');
    }
  };

  // Call the utility to delete the requested repos (one-time, on mount)
  useEffect(() => {
    if (submittedEducationalRepos.length > 0) {
      deleteSubmittedReposByNames(submittedEducationalRepos.map(r => r.name));
    }
    // eslint-disable-next-line
  }, [submittedEducationalRepos]);

  const renderApiErrorBanner = () => {
    if (!apiError) return null;

    return (
      <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              API Rate Limit Exceeded
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              {apiError}
            </p>
            <div className="mt-2">
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-800 dark:text-amber-200 underline hover:no-underline"
              >
                Create a GitHub Personal Access Token →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeView = () => (
    <div className="space-y-8">
      <div className="text-center py-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Code2 className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Amazing GitHub Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Explore millions of public repositories from developers worldwide. Find beginner-friendly projects, educational resources, and contribute to open source.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              🌍 Global Repositories
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              🎓 Educational Content
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              👥 Beginner Friendly
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              ⭐ Updated Daily
            </span>
          </div>
        </div>
      </div>

      {renderApiErrorBanner()}

      <SearchBar
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={searchRepositories}
      />

      {!hasSearched && (
        <div className="space-y-12">
          {/* Educational Repositories Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Educational Resources</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-base font-semibold text-secondary-700 dark:text-secondary-200">
                  <BookOpen className="h-4 w-4" />
                  <span>Perfect for students & educators</span>
                </div>
                <button
                  onClick={refreshRepositories}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-base font-semibold shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            {lastUpdated && (
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            
            {educationalLoading ? (
              <LoadingSpinner />
            ) : educationalRepos.length === 0 && apiError ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Unable to load educational repositories due to API limits.</p>
                <p className="text-sm mt-2">Please configure a GitHub token or try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {educationalRepos.slice(0, 6).map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repository={repo}
                    isBookmarked={bookmarkedRepos.some(r => r.id === repo.id)}
                    onBookmark={user && isSupabaseEnabled ? handleBookmark : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Trending Repositories Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Repositories</h2>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="h-4 w-4" />
                <span>Updated every 30 minutes</span>
              </div>
            </div>
            
            {trendingLoading ? (
              <LoadingSpinner />
            ) : trendingRepos.length === 0 && apiError ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Unable to load trending repositories due to API limits.</p>
                <p className="text-sm mt-2">Please configure a GitHub token or try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trendingRepos.map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repository={repo}
                    isBookmarked={bookmarkedRepos.some(r => r.id === repo.id)}
                    onBookmark={user && isSupabaseEnabled ? handleBookmark : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search Results
              {totalCount > 0 && (
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({totalCount.toLocaleString()} repositories found)
                </span>
              )}
            </h2>
            {filters.beginnerMode && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-400 rounded-full text-sm">
                <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                <span>Beginner Mode Active</span>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : repositories.length === 0 ? (
            <EmptyState type="search" onAction={() => setHasSearched(false)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {repositories.map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  repository={repo}
                  isBookmarked={bookmarkedRepos.some(r => r.id === repo.id)}
                  onBookmark={user && isSupabaseEnabled ? handleBookmark : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderIdeasView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Project Ideas</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get inspired with these project ideas perfect for learning and building your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...projectIdeas, ...aiIdeas].map((idea) => (
          <ProjectIdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 mt-4">
        <button
          onClick={handleGenerateAIIdeas}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50"
          disabled={aiLoading}
        >
          {aiLoading ? 'Generating Ideas...' : 'Generate More Ideas with AI'}
        </button>
        {aiError && <div className="text-error-600 dark:text-error-400 mt-2">{aiError}</div>}
      </div>
    </div>
  );

  const renderSubmitView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submit a Repository</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Help the community discover amazing projects by submitting repositories that others might find useful.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SubmitRepoForm />
      </div>
    </div>
  );

  const renderUploadView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upload Your Repositories</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Share your own GitHub repositories with the GitLink Hub community.
        </p>
      </div>

      <UserRepoUpload />
    </div>
  );

  const renderBookmarksView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Bookmarks</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Keep track of interesting repositories you've discovered.
        </p>
        {!isSupabaseEnabled && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Bookmarks require Supabase configuration. Please set up your Supabase credentials in the .env file to enable this feature.
            </p>
          </div>
        )}
      </div>

      {!isSupabaseEnabled ? (
        <EmptyState type="bookmarks" onAction={() => setCurrentView('home')} />
      ) : bookmarkedRepos.length === 0 ? (
        <EmptyState type="bookmarks" onAction={() => setCurrentView('home')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookmarkedRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              isBookmarked={true}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderSubmittedView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submitted Repositories</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          These are repositories submitted by users for review and inclusion.
        </p>
      </div>
      {submittedError && (
        <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-center space-x-2">
          <span className="text-error-700 dark:text-error-300">{submittedError}</span>
        </div>
      )}
      {submittedLoading ? (
        <LoadingSpinner />
      ) : submittedRepos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No submitted repositories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {submittedRepos.map((repo) => (
            <SubmittedRepoCard key={repo.id} repo={repo} onDelete={handleDeleteSubmittedRepo} />
          ))}
        </div>
      )}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'ideas':
        return renderIdeasView();
      case 'submit':
        return renderSubmitView();
      case 'upload':
        return renderUploadView();
      case 'bookmarks':
        return renderBookmarksView();
      case 'submitted':
        return renderSubmittedView();
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-gray-900 to-primary-900 transition-colors">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
      <footer className="bg-white/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 mt-16 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code2 className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">GitLink Hub</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Discover and explore amazing GitHub repositories from around the world
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;