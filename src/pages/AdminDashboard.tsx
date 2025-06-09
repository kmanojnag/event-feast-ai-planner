
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Star, DollarSign, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    traySize: '',
    description: '',
    dietary: [] as string[],
    available: true
  });

  const [menuItems] = useState([
    {
      id: '1',
      name: 'Butter Chicken',
      category: 'Main Course',
      price: 800,
      traySize: 10,
      rating: 4.8,
      orders: 45,
      dietary: ['Non-Veg'],
      available: true
    },
    {
      id: '2',
      name: 'Paneer Butter Masala',
      category: 'Main Course',
      price: 600,
      traySize: 10,
      rating: 4.6,
      orders: 62,
      dietary: ['Veg', 'Jain'],
      available: true
    }
  ]);

  const handleAddItem = () => {
    toast({
      title: "Menu Item Added!",
      description: `${newItem.name} has been added to your menu.`,
    });
    setNewItem({
      name: '',
      category: '',
      price: '',
      traySize: '',
      description: '',
      dietary: [],
      available: true
    });
  };

  const toggleDietary = (option: string) => {
    setNewItem(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
          <p className="text-gray-600">Manage your menu, orders, and business analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">248</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹1,24,500</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-blue-600 mt-2">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.7</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-xs text-yellow-600 mt-2">142 reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Events Served</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-600 mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add New Item Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Item
                  </CardTitle>
                  <CardDescription>
                    Add a new dish to your catering menu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      placeholder="e.g., Butter Chicken"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="main-course">Main Course</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="dal">Dal</SelectItem>
                        <SelectItem value="bread">Bread</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Tray (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="800"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="traySize">Tray Serves</Label>
                      <Input
                        id="traySize"
                        type="number"
                        placeholder="10"
                        value={newItem.traySize}
                        onChange={(e) => setNewItem(prev => ({ ...prev, traySize: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dietary Options</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Veg', 'Non-Veg', 'Jain', 'Eggless', 'Vegan'].map((option) => (
                        <Badge
                          key={option}
                          variant={newItem.dietary.includes(option) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleDietary(option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your dish..."
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={newItem.available}
                      onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, available: checked }))}
                    />
                    <Label htmlFor="available">Available for orders</Label>
                  </div>

                  <Button onClick={handleAddItem} className="w-full">
                    Add Item to Menu
                  </Button>
                </CardContent>
              </Card>

              {/* Current Menu Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Menu</CardTitle>
                    <CardDescription>
                      Manage your existing menu items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {menuItems.map((item) => (
                        <Card key={item.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold">{item.name}</h3>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                  <span>{item.category}</span>
                                  <span>₹{item.price}/tray</span>
                                  <span>Serves {item.traySize}</span>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                                    <span>{item.rating}</span>
                                  </div>
                                  <span className="text-gray-600">{item.orders} orders</span>
                                  <Badge variant={item.available ? "default" : "secondary"}>
                                    {item.available ? "Available" : "Unavailable"}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.dietary.map((diet, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {diet}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Track and manage your catering orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Order management system will be implemented with Supabase integration
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  Monitor feedback and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Review management system will be implemented with Supabase integration
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  Insights into your catering business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Analytics dashboard will be implemented with charts and metrics
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
