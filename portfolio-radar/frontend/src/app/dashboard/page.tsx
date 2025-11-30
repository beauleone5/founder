'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dashboardAPI, authAPI } from '@/lib/api';
import { DashboardResponse, CompanyDashboardCard } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await dashboardAPI.get();
      setDashboard(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOpportunityColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadDashboard} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard || dashboard.companies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary-600">Portfolio Radar</h1>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Portfolio Radar!</h2>
            <p className="text-gray-600 mb-6">
              You haven't selected any companies yet. Let's get started by choosing companies to track.
            </p>
            <Link href="/select-companies" className="btn-primary inline-block">
              Select Companies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">Portfolio Radar</h1>
            <div className="space-x-4">
              <Link href="/select-companies" className="btn-secondary">
                Edit Companies
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dashboard.top_alerts.length > 0 && (
          <div className="card mb-8 bg-yellow-50 border border-yellow-200">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              Top Alerts Today
            </h2>
            <ul className="space-y-2">
              {dashboard.top_alerts.map((alert, index) => (
                <li key={index} className="text-gray-800">
                  • {alert}
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Your Portfolio Companies</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboard.companies.map((item: CompanyDashboardCard) => (
            <div key={item.company.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {item.company.logo && (
                  <img
                    src={item.company.logo}
                    alt={item.company.name}
                    className="w-12 h-12 rounded mr-3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{item.company.name}</h3>
                  <p className="text-sm text-gray-500">{item.company.sector}</p>
                </div>
              </div>

              {item.latest_insight ? (
                <>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {item.latest_insight.daily_summary || 'No summary available'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Risk Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(item.latest_insight.risk_score)}`}>
                        {item.latest_insight.risk_score?.toFixed(0) || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Opportunity</p>
                      <p className={`text-2xl font-bold ${getOpportunityColor(item.latest_insight.opportunity_score)}`}>
                        {item.latest_insight.opportunity_score?.toFixed(0) || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {item.latest_insight.must_know && (
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-sm font-medium text-blue-900">
                        💡 {item.latest_insight.must_know}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-50 p-4 rounded text-center mb-4">
                  <p className="text-gray-500">No insights available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check back tomorrow</p>
                </div>
              )}

              <Link
                href={`/company/${item.company.id}`}
                className="btn-primary w-full text-center block"
              >
                View Deep Dive
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
