'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">Portfolio Radar</h1>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            AI-Powered Portfolio Intelligence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay ahead with personalized, AI-driven insights for your portfolio companies.
            Daily intelligence, risk scoring, and opportunity analysis delivered to your dashboard.
          </p>
          <button onClick={handleGetStarted} className="btn-primary text-lg px-8 py-4">
            Get Started
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Daily Intelligence</h3>
            <p className="text-gray-600">
              Receive AI-generated summaries of the most important developments for each portfolio company
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Risk & Opportunity Scoring</h3>
            <p className="text-gray-600">
              Automated scoring based on news, GitHub activity, and competitor analysis
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Competitor Tracking</h3>
            <p className="text-gray-600">
              Monitor competitive landscape and get alerts when competitors make moves
            </p>
          </div>
        </div>

        <div className="mt-16 card max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <ol className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-3">1.</span>
              <span>Create an account and log in to your personalized dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-3">2.</span>
              <span>Select the AI companies you want to track from our database of 50+ startups</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-3">3.</span>
              <span>Receive daily AI-powered intelligence summaries, risk scores, and opportunity alerts</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary-600 mr-3">4.</span>
              <span>Deep dive into company insights including news, GitHub activity, and competitor updates</span>
            </li>
          </ol>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Portfolio Radar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
