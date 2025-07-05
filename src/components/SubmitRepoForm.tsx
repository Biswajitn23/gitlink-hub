import React, { useState } from 'react';
import { Send, Github, AlertCircle } from 'lucide-react';
import { SubmittedRepo } from '../types';
<<<<<<< HEAD
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
=======
import { useAuth } from '../context/AuthContext';
import { githubService } from '../services/githubApi';
import { supabase } from '../lib/supabase';

async function fetchGithubAvatar(username: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.avatar_url || null;
  } catch {
    return null;
  }
}
>>>>>>> 89f5a0d (Initial commit)

export function SubmitRepoForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<SubmittedRepo>>({
    github_url: '',
    description: '',
    tech_stack: [],
    difficulty: 'Beginner',
  });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof SubmittedRepo, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.tech_stack?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...(formData.tech_stack || []), techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack?.filter(t => t !== tech) || []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
<<<<<<< HEAD
=======
      // Try to extract username from github_url if user.login is not available
      let submittedBy = user?.login;
      if (!submittedBy && formData.github_url) {
        const match = formData.github_url.match(/github.com\/(.*?)\//);
        if (match && match[1]) {
          submittedBy = match[1];
        }
      }
      // Fetch avatar_url for the submitter
      let avatarUrl = user?.avatar_url;
      if (!avatarUrl && submittedBy) {
        const fetched = await fetchGithubAvatar(submittedBy);
        avatarUrl = fetched || undefined;
      }

      // Check for duplicate by github_url
      const { data: existing, error: checkError } = await supabase
        .from('submitted_repos')
        .select('id')
        .eq('github_url', formData.github_url);
      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        setError('This repository has already been submitted.');
        setLoading(false);
        return;
      }

      // Insert new submission
>>>>>>> 89f5a0d (Initial commit)
      const { error: submitError } = await supabase
        .from('submitted_repos')
        .insert([
          {
            ...formData,
<<<<<<< HEAD
            submitted_by: user?.login || 'anonymous',
            status: 'pending',
          }
        ]);

      if (submitError) throw submitError;
=======
            submitted_by: submittedBy || 'anonymous',
            owner_avatar: avatarUrl || '',
            status: 'approved', // Auto-approve user submissions
          }
        ]);
      if (submitError) {
        console.error('Supabase insert error:', submitError);
        setError(submitError.message || 'An error occurred');
        return;
      }
>>>>>>> 89f5a0d (Initial commit)

      setSuccess(true);
      setFormData({
        github_url: '',
        description: '',
        tech_stack: [],
        difficulty: 'Beginner',
      });
    } catch (err) {
<<<<<<< HEAD
      setError(err instanceof Error ? err.message : 'An error occurred');
=======
      setError(err instanceof Error ? err.message : JSON.stringify(err));
      console.error('SubmitRepoForm unexpected error:', err);
>>>>>>> 89f5a0d (Initial commit)
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div className="w-16 h-16 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-success-600 dark:text-success-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Repository Submitted!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for contributing to GitLink Hub. Your repository submission will be reviewed by our team.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

<<<<<<< HEAD
=======
  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
        <Github className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Sign in to Submit a Repository
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You must be signed in with GitHub to submit a repository.
        </p>
      </div>
    );
  }

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Github className="h-8 w-8 text-primary-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit a Repository</h2>
          <p className="text-gray-600 dark:text-gray-400">Help others discover amazing projects</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
          <span className="text-error-700 dark:text-error-300">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
=======
          <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 89f5a0d (Initial commit)
            GitHub Repository URL *
          </label>
          <input
            type="url"
            required
<<<<<<< HEAD
=======
            id="github_url"
            name="github_url"
>>>>>>> 89f5a0d (Initial commit)
            value={formData.github_url}
            onChange={(e) => handleInputChange('github_url', e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
=======
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 89f5a0d (Initial commit)
            Description *
          </label>
          <textarea
            required
<<<<<<< HEAD
=======
            id="description"
            name="description"
>>>>>>> 89f5a0d (Initial commit)
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what this repository does and why it's useful for beginners..."
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
=======
          <label htmlFor="tech_input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 89f5a0d (Initial commit)
            Technologies Used
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
<<<<<<< HEAD
=======
              id="tech_input"
              name="tech_input"
>>>>>>> 89f5a0d (Initial commit)
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Add a technology (e.g., React, Python)"
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            />
            <button
              type="button"
              onClick={addTechnology}
              className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tech_stack?.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
=======
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
>>>>>>> 89f5a0d (Initial commit)
            Difficulty Level *
          </label>
          <select
            required
<<<<<<< HEAD
=======
            id="difficulty"
            name="difficulty"
>>>>>>> 89f5a0d (Initial commit)
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Repository</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}