
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChefHat, Calendar, Users, Star, UtensilsCrossed, CookingPot, Search, DollarSign, Bot } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // Redirect to appropriate dashboard based on user role
      navigate(`/dashboard/${profile?.role || 'customer'}`);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <span className="text-2xl font-bold text-gray-900">FoodieLink</span>
        </div>
        <div className="space-x-4">
          {user ? (
            <Button onClick={() => navigate(`/dashboard/${profile?.role || 'customer'}`)}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Connect with the Best Food Providers
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Whether you're planning a corporate event, wedding, or party, 
          FoodieLink connects you with top restaurants and caterers in your area.
        </p>
        <div className="space-x-4">
          <Button size="lg" onClick={handleGetStarted} className="bg-orange-600 hover:bg-orange-700">
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/restaurants")}>
            Browse Restaurants
          </Button>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Explore Food Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/restaurants")}>
            <CardHeader className="text-center">
              <UtensilsCrossed className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>
                Discover amazing restaurants and their specialties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Browse Restaurants
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/caterers")}>
            <CardHeader className="text-center">
              <CookingPot className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Caterers</CardTitle>
              <CardDescription>
                Find professional caterers for your special events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Browse Caterers
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/food-items")}>
            <CardHeader className="text-center">
              <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Food Items</CardTitle>
              <CardDescription>
                Browse all available food items and cuisines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Food Items
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Why Choose FoodieLink?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>Easy Event Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Plan your events seamlessly with our intuitive platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>Trusted Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Work with verified restaurants and caterers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>Quality Assured</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Read reviews and ratings from real customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Search className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>Smart Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Find the perfect food providers with intelligent search and recommendations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>Tray-Based Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Transparent, flexible pricing based on serving trays for easy budgeting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Bot className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Get personalized recommendations and instant support from our AI assistant
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-6 w-6" />
                <span className="text-xl font-bold">FoodieLink</span>
              </div>
              <p className="text-gray-400">
                Connecting food lovers with amazing providers since 2024
              </p>
            </div>

            {/* For Customers */}
            <div>
              <h3 className="text-lg font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/restaurants" className="hover:text-white transition-colors">Browse Restaurants</a></li>
                <li><a href="/caterers" className="hover:text-white transition-colors">Find Caterers</a></li>
                <li><a href="/food-items" className="hover:text-white transition-colors">Explore Food Items</a></li>
                <li><a href="/plan-event" className="hover:text-white transition-colors">Plan an Event</a></li>
              </ul>
            </div>

            {/* For Partners */}
            <div>
              <h3 className="text-lg font-semibold mb-4">For Partners</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/auth" className="hover:text-white transition-colors">Join as Provider</a></li>
                <li><a href="/dashboard/provider" className="hover:text-white transition-colors">Provider Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 FoodieLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
