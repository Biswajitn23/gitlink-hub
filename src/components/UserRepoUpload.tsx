<<<<<<< HEAD
import React, { useState } from 'react';
import { Upload, Github, AlertCircle, CheckCircle, Loader } from 'lucide-react';
=======
import { useState } from 'react';
import { Upload, Github, AlertCircle, Loader } from 'lucide-react';
>>>>>>> 89f5a0d (Initial commit)
import { useAuth } from '../context/AuthContext';
import { githubService } from '../services/githubApi';
import { supabase } from '../lib/supabase';

interface UserRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

<<<<<<< HEAD
=======
// Type guard for .eq
function hasEq(obj: any): obj is { eq: Function } {
  return obj && typeof obj.eq === 'function';
}
// Type guard for .data
function hasData(obj: any): obj is { data: any } {
  return obj && typeof obj === 'object' && 'data' in obj;
}

>>>>>>> 89f5a0d (Initial commit)
export function UserRepoUpload() {
  const { user } = useAuth();
  const [userRepos, setUserRepos] = useState<UserRepo[]>([]);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [uploading, setUploading] = useState<number | null>(null);
  const [success, setSuccess] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadUserRepos = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const repos = await githubService.getUserRepositories(user.login);
      setUserRepos(repos);
=======
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);

  const loadUserRepos = async () => {
    if (!user) return;
    console.log('Loading repos for user:', user);
    setLoading(true);
    setError('');

    // Caching logic
    const cacheKey = `github_repos_${user.login}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { repos, timestamp } = JSON.parse(cached);
      // Use cache if less than 10 minutes old
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        setUserRepos(repos);
        setLoading(false);
        console.log('Loaded repos from cache');
        return;
      }
    }

    try {
      const repos = await githubService.getUserRepositories(user.login);
      setUserRepos(repos);
      localStorage.setItem(cacheKey, JSON.stringify({ repos, timestamp: Date.now() }));
      console.log('Fetched repos:', repos);
>>>>>>> 89f5a0d (Initial commit)
    } catch (err) {
      setError('Failed to load your repositories. Please try again.');
      console.error('Error loading user repos:', err);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const uploadRepository = async (repo: UserRepo) => {
    if (!user) return;

    setUploading(repo.id);
    setError('');

    try {
      // Check if repo already exists in our database
      const { data: existing } = await supabase
        .from('user_repositories')
        .select('id')
        .eq('github_id', repo.id)
        .single();

      if (existing) {
        setError('This repository has already been uploaded.');
        return;
      }

      // Upload repository to our database
      const { error: uploadError } = await supabase
        .from('user_repositories')
        .insert([
          {
            github_id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            topics: repo.topics,
            owner_login: user.login,
            owner_avatar: user.avatar_url,
            uploaded_by: user.id,
            status: 'approved' // Auto-approve user's own repos
          }
        ]);

      if (uploadError) throw uploadError;

      setSuccess(repo.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload repository');
      console.error('Error uploading repo:', err);
    } finally {
      setUploading(null);
    }
  };

=======
>>>>>>> 89f5a0d (Initial commit)
  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
        <Github className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Sign in to Upload Your Repositories
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with GitHub to share your projects with the community.
        </p>
      </div>
    );
  }

<<<<<<< HEAD
=======
  if (!supabase || typeof supabase.from !== 'function') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
        <AlertCircle className="h-16 w-16 text-error-400 dark:text-error-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Supabase Not Configured
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please check your .env file and Supabase project configuration.
        </p>
      </div>
    );
  }

>>>>>>> 89f5a0d (Initial commit)
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Upload className="h-8 w-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload Your Repositories
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Share your projects with the GitLink Hub community
              </p>
            </div>
          </div>
          
          <button
            onClick={loadUserRepos}
            disabled={loading}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            <span>{loading ? 'Loading...' : 'Load My Repos'}</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
            <span className="text-error-700 dark:text-error-300">{error}</span>
          </div>
        )}

<<<<<<< HEAD
=======
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
            <span className="text-green-700 dark:text-green-300 font-semibold">{success}</span>
          </div>
        )}

>>>>>>> 89f5a0d (Initial commit)
        {userRepos.length === 0 && !loading && (
          <div className="text-center py-8">
            <Github className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Click "Load My Repos" to see your GitHub repositories
            </p>
          </div>
        )}

        {userRepos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {repo.full_name}
                    </p>
                  </div>
<<<<<<< HEAD
                  
                  <button
                    onClick={() => uploadRepository(repo)}
                    disabled={uploading === repo.id || success === repo.id}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      success === repo.id
                        ? 'bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-400'
                        : uploading === repo.id
                        ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/40'
                    }`}
                  >
                    {uploading === repo.id ? (
                      <>
                        <Loader className="h-3 w-3 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : success === repo.id ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Uploaded</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3 w-3" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
=======
                  <div className="flex flex-col items-end">
                    {selectedRepoId === repo.id ? (
                      <button
                        onClick={async () => {
                          setError("");
                          setSuccess(null);
                          try {
                            // Check if repo already exists in submitted_repos
                            // @ts-ignore
                            let existing: any[] = [];
                            const selectResult = supabase
                              .from('submitted_repos')
                              .select('id');
                            if (hasEq(selectResult)) {
                              const eq1 = await selectResult.eq('github_url', repo.html_url);
                              if (hasEq(eq1)) {
                                const eq2 = await eq1.eq('submitted_by', user.login);
                                if (hasData(eq2) && Array.isArray(eq2.data)) {
                                  existing = eq2.data;
                                }
                              } else if (hasData(eq1) && Array.isArray(eq1.data)) {
                                existing = eq1.data;
                              }
                            } else if (typeof (selectResult as Promise<any>).then === 'function') {
                              const resp = await selectResult;
                              if (hasData(resp) && Array.isArray((resp as { data: any }).data)) {
                                const data = (resp as { data: any }).data;
                                existing = data;
                              }
                            }
                            if (existing && existing.length > 0) {
                              setError('This repository has already been submitted.');
                              return;
                            }
                            // Upload repository to submitted_repos (for Educational Resources)
                            const { error: uploadError } = await supabase
                              .from('submitted_repos')
                              .insert([
                                {
                                  github_url: repo.html_url,
                                  description: repo.description || '',
                                  tech_stack: Array.isArray(repo.topics) ? repo.topics : [],
                                  submitted_by: user.login,
                                  status: 'approved'
                                }
                              ]);
                            if (uploadError) throw uploadError;
                            setSuccess('Repository uploaded to Educational Resources!');
                            setError('');
                            setSelectedRepoId(null);
                            setTimeout(() => setSuccess(null), 3000);
                          } catch (err) {
                            setError('Failed to upload repository.');
                          }
                        }}
                        className="ml-2 px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                      >
                        Upload
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedRepoId(repo.id)}
                        className="ml-2 px-3 py-1 rounded bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
                      >
                        Choose
                      </button>
                    )}
                  </div>
>>>>>>> 89f5a0d (Initial commit)
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-3">
                    {repo.language && (
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span>{repo.language}</span>
                      </span>
                    )}
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                  </div>
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                      >
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        +{repo.topics.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}