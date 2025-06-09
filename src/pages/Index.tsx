
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Users, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: '#df7234' }}>EventBite</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/restaurants" className="text-gray-700 hover:text-orange-600 transition-colors">Restaurants</Link>
              <Link to="/caterers" className="text-gray-700 hover:text-orange-600 transition-colors">Caterers</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors">How it Works</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Perfect Catering for
            <span className="block" style={{ color: '#df7234' }}>EVERY Event</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, discover the best restaurants, caterers, and cloud kitchens for your special events. AI-powered planning makes it effortless.
          </p>
          
          {/* Quick Search */}
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="Enter location" className="pl-10" />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="Number of guests" className="pl-10" type="number" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="Event date" className="pl-10" type="date" />
              </div>
              <Button 
                className="w-full text-white"
                style={{ backgroundColor: '#df7234' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c86a2f'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#df7234'}
                asChild
              >
                <Link to="/auth">
                  <Search className="mr-2 h-4 w-4" />
                  Find Caterers
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#df7234' }}>500+</div>
              <div className="text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#df7234' }}>200+</div>
              <div className="text-gray-600">Caterers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#df7234' }}>50K+</div>
              <div className="text-gray-600">Events Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#df7234' }}>4.8</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EventBite?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience seamless event catering with our innovative platform designed for modern celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#f4d4c0' }}>
                  <Search className="h-6 w-6" style={{ color: '#df7234' }} />
                </div>
                <CardTitle>Smart Discovery</CardTitle>
                <CardDescription>
                  Find the perfect caterers based on your event size, cuisine preferences, and location.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Tray-Based Pricing</CardTitle>
                <CardDescription>
                  Transparent pricing with real-time calculations based on guest count and menu selections.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get personalized recommendations and menu planning assistance from our AI chat agent.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Event Types
            </h2>
            <p className="text-xl text-gray-600">
              We cater to all kinds of celebrations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Weddings", image: "🎊", count: "2.5K+ events" },
              { name: "Birthdays", image: "🎂", count: "5K+ events" },
              { name: "Corporate", image: "🏢", count: "1.2K+ events" },
              { name: "Festivals", image: "🎆", count: "800+ events" }
            ].map((category) => (
              <Card key={category.name} className="border-none shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.image}</div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EventBite</h3>
              <p className="text-gray-400">
                Making event catering simple, transparent, and delightful.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>How it Works</li>
                <li>Event Planning</li>
                <li>Pricing</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Partners</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Restaurant Partners</li>
                <li>Caterer Registration</li>
                <li>Partner Dashboard</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventBite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
