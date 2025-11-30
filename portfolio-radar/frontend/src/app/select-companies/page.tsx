'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { companiesAPI, selectionsAPI } from '@/lib/api';
import { Company } from '@/types';

export default function SelectCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      setError('Please select at least one company');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await selectionsAPI.save(Array.from(selectedIds));
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to save selections');
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading companies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Companies to Track</h1>
          <p className="text-gray-600 mb-4">
            Choose the AI companies you want to monitor. You can change your selection anytime from the dashboard.
          </p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedIds.size} {selectedIds.size === 1 ? 'company' : 'companies'} selected
            </p>
            <button
              onClick={handleSave}
              disabled={saving || selectedIds.size === 0}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save My Dashboard'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              onClick={() => toggleCompany(company.id)}
              className={`card cursor-pointer transition-all ${
                selectedIds.has(company.id)
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-10 h-10 rounded mr-3"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{company.sector}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{company.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedIds.has(company.id)}
                  onChange={() => toggleCompany(company.id)}
                  className="ml-3 h-5 w-5 text-primary-600"
                />
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-gray-600">No companies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
