import React from 'react';
import { Star, GitFork, Clock, ExternalLink, Heart, Calendar } from 'lucide-react';
import { Repository } from '../types';
import { useAuth } from '../context/AuthContext';

interface RepositoryCardProps {
  repository: Repository;
  isBookmarked?: boolean;
  onBookmark?: (repo: Repository) => void;
}

export function RepositoryCard({ repository, isBookmarked = false, onBookmark }: RepositoryCardProps) {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      javascript: 'bg-yellow-400',
      typescript: 'bg-blue-500',
      python: 'bg-green-500',
      java: 'bg-red-500',
      go: 'bg-cyan-500',
      rust: 'bg-orange-600',
      php: 'bg-purple-500',
      ruby: 'bg-red-600',
      swift: 'bg-orange-400',
      kotlin: 'bg-purple-600',
      dart: 'bg-blue-400',
      html: 'bg-orange-500',
      css: 'bg-blue-600',
    };
    return colors[language?.toLowerCase() || ''] || 'bg-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
              className="h-10 w-10 rounded-full border-2 border-gray-100 dark:border-gray-600"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {repository.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{repository.owner.login}</p>
            </div>
          </div>
          
          {user && onBookmark && (
            <button
              onClick={() => onBookmark(repository)}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40'
                  : 'text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {repository.description || 'No description available.'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {repository.language && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <span
                className={`w-2 h-2 rounded-full mr-1 ${getLanguageColor(repository.language)}`}
              />
              {repository.language}
            </span>
          )}
          {repository.topics?.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
            >
              {topic}
            </span>
          ))}
          {repository.topics?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              +{repository.topics.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{repository.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="h-4 w-4" />
              <span>{repository.forks_count.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Updated {formatDate(repository.updated_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(repository.created_at)}</span>
          </div>
          
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <span>View Repository</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}