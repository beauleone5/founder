'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddCompanyForm from '@/components/AddCompanyForm';
import CompanyList from '@/components/CompanyList';
import NewsFeed from '@/components/NewsFeed';
import { Company, NewsItemWithScore } from '@/lib/types';

const USER_ID_KEY = 'boardsignal_user_id';

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [news, setNews] = useState<NewsItemWithScore[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Initialize or retrieve user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Fetch companies when userId is set
  useEffect(() => {
    if (!userId) return;

    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const response = await fetch(`/api/companies?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCompanies(data.companies || []);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [userId]);

  // Fetch news when companies change
  useEffect(() => {
    if (!userId || companies.length === 0) {
      setNews([]);
      return;
    }

    const fetchNews = async () => {
      setIsLoadingNews(true);
      try {
        const response = await fetch(`/api/news?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data.news || []);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNews();
  }, [userId, companies]);

  const handleCompanyChange = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/companies?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Failed to refresh companies:', error);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Initializing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">BoardSignal</h1>
          <p className="mt-1 text-sm text-gray-600">
            News signals for your portfolio companies
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Company Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Followed Companies
              </h2>

              <div className="mb-6">
                <AddCompanyForm
                  onCompanyAdded={handleCompanyChange}
                  userId={userId}
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                {isLoadingCompanies ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <CompanyList
                    companies={companies}
                    onCompanyRemoved={handleCompanyChange}
                    userId={userId}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Main Content - News Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  News Feed
                </h2>
                {news.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {news.length} {news.length === 1 ? 'article' : 'articles'}
                  </span>
                )}
              </div>

              <NewsFeed news={news} isLoading={isLoadingNews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
