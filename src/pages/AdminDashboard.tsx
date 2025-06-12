
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPanel from '@/components/AdminPanel';
import MenuManager from '@/components/MenuManager';
import { Users, ChefHat, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only allow admin access
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
          <p className="text-center text-gray-600">Manage providers, menus, and platform settings</p>
        </div>

        <Tabs defaultValue="providers" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Providers
            </TabsTrigger>
            <TabsTrigger value="menus" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Manage Menus
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="providers">
            <AdminPanel />
          </TabsContent>

          <TabsContent value="menus">
            <MenuManager />
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Platform Settings</h3>
              <p className="text-gray-600">Advanced platform configuration options coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
