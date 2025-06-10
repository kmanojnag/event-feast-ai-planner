
import React from 'react';
import FoodItemsGrid from '@/components/FoodItemsGrid';

const FoodItems: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Food Items</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse all available food items from restaurants and caterers
          </p>
        </div>

        <FoodItemsGrid />
      </div>
    </div>
  );
};

export default FoodItems;
