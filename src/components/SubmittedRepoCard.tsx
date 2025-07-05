import { SubmittedRepo } from '../types';
import { Github, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface SubmittedRepoCardProps {
  repo: SubmittedRepo;
  onDelete?: (id: string) => void;
}

export function SubmittedRepoCard({ repo, onDelete }: SubmittedRepoCardProps) {
  const { user } = useAuth();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-3">
        {repo.owner_avatar && (
          <img src={repo.owner_avatar} alt={repo.submitted_by} className="h-8 w-8 rounded-full border-2 border-primary-100 dark:border-primary-700" />
        )}
        <Github className="h-6 w-6 text-primary-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          {repo.github_url ? (
            <a href={repo.github_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {repo.github_url.replace('https://github.com/', '')}
            </a>
          ) : 'Repository'}
        </h3>
        <span className="ml-auto px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {repo.status}
        </span>
        {user &&
          ((user.login && repo.submitted_by && user.login.toLowerCase() === repo.submitted_by.toLowerCase()) ||
            (!repo.submitted_by && repo.github_url && user.login && repo.github_url.toLowerCase().includes(user.login.toLowerCase()))) &&
          onDelete && (
            <button
              onClick={() => repo.id && onDelete(repo.id)}
              className="ml-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
              title="Delete this submission"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
          )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{repo.description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {repo.tech_stack?.map((tech) => (
          <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400">
            {tech}
          </span>
        ))}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Difficulty: {repo.difficulty}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Submitted by: {repo.submitted_by}
      </div>
    </div>
  );
}
