
import React from 'react';
import { useProviders } from '@/hooks/useProviders';
import ProviderCard from '@/components/ProviderCard';

const Caterers: React.FC = () => {
  const { providers, loading } = useProviders('independent_caterer');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Caterers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find professional caterers for your special events
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No caterers found</div>
            <p className="text-gray-400">Check back later for new caterer listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Caterers;
