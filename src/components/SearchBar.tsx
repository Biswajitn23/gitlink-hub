import React from 'react';
import { Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

const LANGUAGES = [
  'all', 'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'php', 
  'ruby', 'swift', 'kotlin', 'dart', 'c', 'cpp', 'csharp', 'html', 'css'
];

const SORT_OPTIONS = [
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'created', label: 'Recently Created' }
] as const;

export function SearchBar({ filters, onFiltersChange, onSearch }: SearchBarProps) {
  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);
    
    // Auto-search when beginner mode is toggled for immediate feedback
    if (field === 'beginnerMode') {
      setTimeout(() => onSearch(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search repositories... (e.g., 'react todo app', 'python web scraper')"
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Language:</label>
            <select
              value={filters.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              value={filters.sort}
              onChange={(e) => handleInputChange('sort', e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleInputChange('beginnerMode', !filters.beginnerMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
              filters.beginnerMode
                ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white border-secondary-500 shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filters.beginnerMode ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            <span>Beginner Mode</span>
            {filters.beginnerMode && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                ON
              </span>
            )}
          </button>
        </div>

        {filters.beginnerMode && (
          <div className="mt-3 p-3 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg">
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              <strong>Beginner Mode Active:</strong> Showing repositories with beginner-friendly topics, good documentation, 
              and reasonable complexity. Perfect for students and new developers!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}