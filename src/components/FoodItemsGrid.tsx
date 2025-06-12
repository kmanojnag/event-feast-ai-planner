
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodItem, useFoodItems } from "@/hooks/useFoodItems";
import { Search, Leaf, Users, Filter } from "lucide-react";

const FoodItemsGrid: React.FC = () => {
  const { foodItems, loading } = useFoodItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || item.cuisine_type === cuisineFilter;
    const matchesDietary = dietaryFilter === 'all' || 
                          (dietaryFilter === 'vegetarian' && item.is_vegetarian) ||
                          (dietaryFilter === 'vegan' && item.is_vegan);
    
    return matchesSearch && matchesCuisine && matchesDietary && item.is_available;
  });

  const uniqueCuisines = Array.from(new Set(foodItems.map(item => item.cuisine_type)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Food Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                {uniqueCuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Dietary preferences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-gray-600">
        Showing {filteredItems.length} of {foodItems.length} food items
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-sm text-gray-600">No image</p>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              
              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <div className="font-bold text-lg text-green-600">${item.price_full_tray}</div>
                  <div className="text-xs text-gray-500">
                    Half: ${item.price_half_tray} | Quarter: ${item.price_quarter_tray}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {item.tray_size}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{item.cuisine_type}</Badge>
                {item.is_vegetarian && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Leaf className="h-3 w-3 mr-1" />
                    Veg
                  </Badge>
                )}
                {item.is_vegan && (
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    <Leaf className="h-3 w-3 mr-1" />
                    Vegan
                  </Badge>
                )}
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No food items found matching your criteria</div>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setCuisineFilter('all');
            setDietaryFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodItemsGrid;
