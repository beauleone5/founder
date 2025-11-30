'use client';

import { NewsItemWithScore } from '@/lib/types';

interface NewsCardProps {
  article: NewsItemWithScore;
}

function getImpactColor(score: number): string {
  if (score >= 8) return 'bg-red-100 text-red-800 border-red-200';
  if (score >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-green-100 text-green-800 border-green-200';
}

function getImpactLabel(score: number): string {
  if (score >= 8) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    if (diffInHours === 0) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {article.companyName}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {article.title}
            </a>
          </h3>

          {article.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium">{article.source}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div
            className={`px-3 py-2 rounded-md border text-center min-w-[80px] ${getImpactColor(
              article.impactScore
            )}`}
          >
            <div className="text-xs font-medium uppercase tracking-wide mb-1">
              {getImpactLabel(article.impactScore)}
            </div>
            <div className="text-lg font-bold">
              {article.impactScore}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
