import React from 'react';
import { Search, BookOpen, Github } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'bookmarks' | 'projects';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: <Search className="h-16 w-16 text-gray-300 dark:text-gray-600" />,
          title: 'No repositories found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          actionText: 'Clear Filters',
        };
      case 'bookmarks':
        return {
          icon: <Github className="h-16 w-16 text-gray-300 dark:text-gray-600" />,
          title: 'No bookmarks yet',
          description: 'Start exploring repositories and bookmark the ones you find interesting.',
          actionText: 'Explore Repositories',
        };
      case 'projects':
        return {
          icon: <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600" />,
          title: 'No project ideas available',
          description: 'Check back later for new project ideas and inspiration.',
          actionText: null,
        };
      default:
        return {
          icon: <Search className="h-16 w-16 text-gray-300 dark:text-gray-600" />,
          title: 'Nothing here yet',
          description: 'Start exploring to see content.',
          actionText: null,
        };
    }
  };

  const content = getContent();

  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-4">
        {content.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{content.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{content.description}</p>
      {content.actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {content.actionText}
        </button>
      )}
    </div>
  );
}