
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, DollarSign, Calendar, Users, LogOut, TrendingUp, Plus } from 'lucide-react';
import { useFoodItems } from '@/hooks/useFoodItems';
import AddFoodItemModal from '@/components/AddFoodItemModal';
import FoodItemCard from '@/components/FoodItemCard';

const ProviderDashboard = () => {
  const { profile, signOut } = useAuth();
  const { foodItems, loading } = useFoodItems();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: '#df7234' }}>EventBite</h1>
              <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Provider</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {profile?.name}</span>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h2>
          <p className="text-gray-600">Manage your catering business and menu</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold">{foodItems.length}</p>
                </div>
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month Revenue</p>
                  <p className="text-2xl font-bold">₹45,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customer Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Management Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Menu</h3>
            <Button onClick={() => setShowAddModal(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : foodItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No menu items yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first menu item to showcase your offerings</p>
                <Button onClick={() => setShowAddModal(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item) => (
                <FoodItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest catering requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No orders yet. Complete your menu to start receiving orders!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddFoodItemModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default ProviderDashboard;
