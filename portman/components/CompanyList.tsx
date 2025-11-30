'use client';

import { Company } from '@/lib/types';

interface CompanyListProps {
  companies: Company[];
  onCompanyRemoved: () => void;
  userId: string;
}

export default function CompanyList({ companies, onCompanyRemoved, userId }: CompanyListProps) {
  const handleUnfollow = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/${companyId}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow company');
      }

      onCompanyRemoved();
    } catch (err) {
      console.error('Error unfollowing company:', err);
      alert('Failed to unfollow company');
    }
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No companies followed yet.</p>
        <p className="text-sm mt-1">Add a company to start tracking news.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {companies.map((company) => (
        <div
          key={company.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900">{company.name}</div>
            {company.ticker && (
              <div className="text-sm text-gray-500">{company.ticker}</div>
            )}
          </div>
          <button
            onClick={() => handleUnfollow(company.id)}
            className="ml-3 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600 transition-colors"
            aria-label="Unfollow"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
