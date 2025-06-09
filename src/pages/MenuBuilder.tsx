
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Star, DollarSign, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  traySize: number;
  rating: number;
  dietary: string[];
  description: string;
  image: string;
}

const MenuBuilder = () => {
  const { toast } = useToast();
  const [guestCount, setGuestCount] = useState(50);
  const [budget, setBudget] = useState(25000);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Butter Chicken',
      category: 'Main Course',
      price: 800,
      traySize: 10,
      rating: 4.8,
      dietary: ['Non-Veg'],
      description: 'Rich and creamy butter chicken with aromatic spices',
      image: '🍛'
    },
    {
      id: '2',
      name: 'Paneer Butter Masala',
      category: 'Main Course',
      price: 600,
      traySize: 10,
      rating: 4.6,
      dietary: ['Veg', 'Jain'],
      description: 'Cottage cheese in rich tomato and butter gravy',
      image: '🧈'
    },
    {
      id: '3',
      name: 'Biryani Combo',
      category: 'Rice',
      price: 900,
      traySize: 12,
      rating: 4.9,
      dietary: ['Non-Veg'],
      description: 'Fragrant basmati rice with tender meat and spices',
      image: '🍚'
    },
    {
      id: '4',
      name: 'Dal Makhani',
      category: 'Dal',
      price: 400,
      traySize: 10,
      rating: 4.5,
      dietary: ['Veg'],
      description: 'Creamy black lentils slow-cooked with butter',
      image: '🍲'
    },
    {
      id: '5',
      name: 'Naan Basket',
      category: 'Bread',
      price: 300,
      traySize: 20,
      rating: 4.4,
      dietary: ['Veg'],
      description: 'Assorted fresh naans - butter, garlic, plain',
      image: '🥖'
    },
    {
      id: '6',
      name: 'Gulab Jamun',
      category: 'Dessert',
      price: 350,
      traySize: 15,
      rating: 4.7,
      dietary: ['Veg'],
      description: 'Traditional milk-based sweet in sugar syrup',
      image: '🍯'
    }
  ];

  const calculateTraysNeeded = (item: MenuItem) => {
    return Math.ceil(guestCount / item.traySize);
  };

  const calculateItemTotal = (item: MenuItem) => {
    const quantity = selectedItems[item.id] || 0;
    return quantity * item.price;
  };

  const getTotalCost = () => {
    return Object.keys(selectedItems).reduce((total, itemId) => {
      const item = menuItems.find(m => m.id === itemId);
      if (item) {
        return total + calculateItemTotal(item);
      }
      return total;
    }, 0);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setSelectedItems(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const totalCost = getTotalCost();
  const isOverBudget = totalCost > budget;
  const budgetPercentage = (totalCost / budget) * 100;

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as {[key: string]: MenuItem[]});

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Menu</h1>
          <p className="text-gray-600">Select items and quantities for your event</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-3">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => {
                    const quantity = selectedItems[item.id] || 0;
                    const traysNeeded = calculateTraysNeeded(item);
                    
                    return (
                      <Card key={item.id} className="border-2 hover:border-orange-200 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{item.image}</div>
                              <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                                    <span className="text-sm">{item.rating}</span>
                                  </div>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-sm text-gray-600">₹{item.price}/tray</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.dietary.map((diet, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {diet}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              1 tray serves {item.traySize} people
                            </div>
                            <div className="text-orange-600 font-medium">
                              Suggested: {traysNeeded} trays for {guestCount} guests
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium w-8 text-center">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {quantity > 0 && (
                              <div className="text-right">
                                <div className="font-semibold">₹{calculateItemTotal(item)}</div>
                                <div className="text-xs text-gray-500">{quantity} trays</div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Guests</label>
                    <Input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Budget (₹)</label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Budget Tracker */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Budget Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Cost</span>
                      <span className="font-semibold">₹{totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget</span>
                      <span>₹{budget.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isOverBudget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className={`flex items-center text-sm ${
                      isOverBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isOverBudget ? (
                        <AlertCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      {isOverBudget 
                        ? `₹${(totalCost - budget).toLocaleString()} over budget`
                        : `₹${(budget - totalCost).toLocaleString()} remaining`
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              {Object.keys(selectedItems).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedItems).map(([itemId, quantity]) => {
                        const item = menuItems.find(m => m.id === itemId);
                        if (!item) return null;
                        
                        return (
                          <div key={itemId} className="flex justify-between text-sm">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500">{quantity} trays</div>
                            </div>
                            <div className="text-right">
                              <div>₹{calculateItemTotal(item)}</div>
                            </div>
                          </div>
                        );
                      })}
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalCost.toLocaleString()}</span>
                      </div>
                      
                      <Button 
                        className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                        onClick={() => toast({
                          title: "Order Placed!",
                          description: "Your catering order has been submitted successfully.",
                        })}
                      >
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
