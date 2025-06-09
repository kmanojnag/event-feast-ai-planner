
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, DollarSign, Users, LogOut, Plus, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';

const CustomerDashboard = () => {
  const { profile, signOut } = useAuth();
  const { events, loading } = useEvents();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: '#df7234' }}>EventBite</h1>
              <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Customer</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h2>
          <p className="text-gray-600">Plan events and manage your catering orders</p>
        </div>

        {/* Quick Action - Plan New Event */}
        <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to plan a new event?</h3>
                <p className="text-gray-600">Get started by telling us about your event and we'll connect you with perfect caterers</p>
              </div>
              <Button 
                onClick={() => navigate('/plan-event')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Plan New Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Events</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
              <CardDescription>Manage your planned events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-16"></div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No events planned yet</p>
                  <Button 
                    onClick={() => navigate('/plan-event')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Plan Your First Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} • {event.guest_count} guests</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded capitalize ${
                        event.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  ))}
                  {events.length > 3 && (
                    <Button variant="outline" className="w-full">
                      View All Events ({events.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest booking updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
