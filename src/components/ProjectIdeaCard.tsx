import React from 'react';
import { Clock, Code, CheckCircle } from 'lucide-react';
import { ProjectIdea } from '../types';

interface ProjectIdeaCardProps {
  idea: ProjectIdea;
}

export function ProjectIdeaCard({ idea }: ProjectIdeaCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800';
      case 'Intermediate':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 border-warning-200 dark:border-warning-800';
      case 'Advanced':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400 border-error-200 dark:border-error-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{idea.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(idea.difficulty)}`}
          >
            {idea.difficulty}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          {idea.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{idea.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Code className="h-4 w-4" />
            <span>{idea.technologies.length} technologies</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies:</h4>
          <div className="flex flex-wrap gap-1">
            {idea.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {idea.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-3 w-3 text-success-500 dark:text-success-400 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {idea.features.length > 3 && (
              <li className="text-sm text-gray-400 dark:text-gray-500 pl-5">
                +{idea.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}