'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { companiesAPI, dashboardAPI, authAPI } from '@/lib/api';
import { Company, DailyInsight } from '@/types';

export default function CompanyDeepDivePage() {
  const router = useRouter();
  const params = useParams();
  const companyId = parseInt(params.id as string);

  const [company, setCompany] = useState<Company | null>(null);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [companyId]);

  const loadData = async () => {
    try {
      const [companyData, insightsData] = await Promise.all([
        companiesAPI.getById(companyId),
        dashboardAPI.getCompanyInsights(companyId),
      ]);
      setCompany(companyData);
      setInsights(insightsData);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else if (err.response?.status === 403) {
        setError('You need to select this company first');
      } else {
        setError('Failed to load company data');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading company data...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card">
            <p className="text-red-600 mb-4">{error || 'Company not found'}</p>
            <Link href="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const latestInsight = insights[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-16 h-16 rounded mr-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-gray-600">{company.sector}</p>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm"
                  >
                    {company.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {company.description && (
            <p className="text-gray-700 mb-4">{company.description}</p>
          )}

          {company.competitor_list && company.competitor_list.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Competitors:</h3>
              <div className="flex flex-wrap gap-2">
                {company.competitor_list.map((competitor, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {latestInsight && (
          <div className="card mb-8 bg-blue-50 border border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Latest Intelligence</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded">
                <p className="text-sm text-gray-500">Risk Score</p>
                <p className="text-3xl font-bold text-red-600">
                  {latestInsight.risk_score?.toFixed(0) || 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <p className="text-sm text-gray-500">Opportunity Score</p>
                <p className="text-3xl font-bold text-green-600">
                  {latestInsight.opportunity_score?.toFixed(0) || 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded col-span-2">
                <p className="text-sm text-gray-500 mb-2">Must Know Today</p>
                <p className="font-medium">{latestInsight.must_know || 'N/A'}</p>
              </div>
            </div>

            {latestInsight.daily_summary && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-gray-700">{latestInsight.daily_summary}</p>
              </div>
            )}

            {latestInsight.top_insights && latestInsight.top_insights.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Insights</h3>
                <ul className="list-disc list-inside space-y-1">
                  {latestInsight.top_insights.map((insight, index) => (
                    <li key={index} className="text-gray-700">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {latestInsight?.news_data && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4">📰 Recent News</h3>
              {latestInsight.news_data.articles?.slice(0, 5).map((article: any, index: number) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-0">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {article.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {article.source?.name} • {formatDate(article.publishedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {latestInsight?.github_data && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4">💻 GitHub Activity</h3>
              {latestInsight.github_data.repositories?.map((repo: any, index: number) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-0">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {repo.full_name}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>⭐ {repo.stars?.toLocaleString()} stars</span>
                    {repo.language && <span>📝 {repo.language}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {latestInsight?.competitor_data && (
          <div className="card mb-8">
            <h3 className="text-xl font-bold mb-4">🎯 Competitor Intelligence</h3>
            <div className="space-y-6">
              {latestInsight.competitor_data.competitors?.map((comp: any, index: number) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4">
                  <h4 className="font-semibold text-lg mb-2">{comp.name}</h4>
                  {comp.recent_news?.slice(0, 2).map((article: any, idx: number) => (
                    <div key={idx} className="mb-2">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        {article.title}
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="text-xl font-bold mb-4">📅 Historical Insights</h3>
          {insights.length > 1 ? (
            <div className="space-y-4">
              {insights.slice(1).map((insight) => (
                <div key={insight.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{formatDate(insight.date)}</h4>
                    <div className="flex gap-4 text-sm">
                      <span className="text-red-600">
                        Risk: {insight.risk_score?.toFixed(0) || 'N/A'}
                      </span>
                      <span className="text-green-600">
                        Opp: {insight.opportunity_score?.toFixed(0) || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{insight.daily_summary}</p>
                  {insight.must_know && (
                    <p className="text-sm text-blue-700 mt-2">💡 {insight.must_know}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No historical data available yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
