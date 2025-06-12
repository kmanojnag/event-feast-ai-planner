
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useMenus } from "@/hooks/useMenus";
import { useFoodItems } from "@/hooks/useFoodItems";
import { useProviders } from "@/hooks/useProviders";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FoodCategory = Database['public']['Enums']['food_category'];

const MenuManager = () => {
  const { menus, createMenu, refetch: refetchMenus } = useMenus();
  const { providers } = useProviders();
  const { toast } = useToast();
  
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showFoodItemForm, setShowFoodItemForm] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  
  const [menuForm, setMenuForm] = useState({
    title: '',
    description: '',
    provider_id: ''
  });

  const [foodItemForm, setFoodItemForm] = useState({
    name: '',
    description: '',
    category: 'veg' as FoodCategory,
    price_full_tray: '',
    price_half_tray: '',
    price_quarter_tray: '',
    cuisine_type: '',
    is_vegetarian: true,
    is_vegan: false,
    is_available: true
  });

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createMenu(menuForm);
    if (result) {
      setMenuForm({ title: '', description: '', provider_id: '' });
      setShowMenuForm(false);
    }
  };

  const handleCreateFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get provider_id from the selected menu
      const selectedMenu = menus.find(m => m.id === selectedMenuId);
      if (!selectedMenu) {
        toast({
          title: "Error",
          description: "Selected menu not found",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('food_items')
        .insert({
          menu_id: selectedMenuId,
          provider_id: selectedMenu.provider_id,
          name: foodItemForm.name,
          description: foodItemForm.description,
          category: foodItemForm.category,
          cuisine_type: foodItemForm.cuisine_type,
          price_full_tray: parseFloat(foodItemForm.price_full_tray),
          price_half_tray: parseFloat(foodItemForm.price_half_tray),
          price_quarter_tray: parseFloat(foodItemForm.price_quarter_tray),
          tray_size: 'Available in multiple sizes',
          is_vegetarian: foodItemForm.is_vegetarian,
          is_vegan: foodItemForm.is_vegan,
          is_available: foodItemForm.is_available
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Food item added successfully"
      });

      setFoodItemForm({
        name: '',
        description: '',
        category: 'veg' as FoodCategory,
        price_full_tray: '',
        price_half_tray: '',
        price_quarter_tray: '',
        cuisine_type: '',
        is_vegetarian: true,
        is_vegan: false,
        is_available: true
      });
      setShowFoodItemForm(false);
    } catch (error) {
      console.error('Error creating food item:', error);
      toast({
        title: "Error",
        description: "Failed to add food item",
        variant: "destructive"
      });
    }
  };

  const foodCategories: FoodCategory[] = [
    'veg', 'non_veg', 'halal', 'jain', 'kosher', 'dessert', 'snacks', 
    'drinks', 'salad', 'rice', 'breads', 'fusion', 'regional', 
    'south_indian', 'north_indian', 'indochinese', 'tandoor'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <Button onClick={() => setShowMenuForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu
          </Button>
        </div>

        {/* Create Menu Form */}
        {showMenuForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMenu} className="space-y-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select value={menuForm.provider_id} onValueChange={(value) => setMenuForm({...menuForm, provider_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name} ({provider.provider_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="title">Menu Title</Label>
                  <Input
                    id="title"
                    value={menuForm.title}
                    onChange={(e) => setMenuForm({...menuForm, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Create Menu</Button>
                  <Button type="button" variant="outline" onClick={() => setShowMenuForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Menus List */}
        <div className="grid gap-6">
          {menus.map(menu => (
            <Card key={menu.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{menu.title}</CardTitle>
                    {menu.description && <p className="text-gray-600 mt-1">{menu.description}</p>}
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedMenuId(menu.id);
                      setShowFoodItemForm(true);
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food Item
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Create Food Item Form */}
        {showFoodItemForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add Food Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFoodItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={foodItemForm.name}
                      onChange={(e) => setFoodItemForm({...foodItemForm, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cuisine_type">Cuisine Type</Label>
                    <Input
                      id="cuisine_type"
                      value={foodItemForm.cuisine_type}
                      onChange={(e) => setFoodItemForm({...foodItemForm, cuisine_type: e.target.value})}
                      placeholder="e.g., North Indian, Italian"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={foodItemForm.description}
                    onChange={(e) => setFoodItemForm({...foodItemForm, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={foodItemForm.category} onValueChange={(value: FoodCategory) => setFoodItemForm({...foodItemForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {foodCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_full">Full Tray Price ($)</Label>
                    <Input
                      id="price_full"
                      type="number"
                      step="0.01"
                      value={foodItemForm.price_full_tray}
                      onChange={(e) => setFoodItemForm({...foodItemForm, price_full_tray: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_half">Half Tray Price ($)</Label>
                    <Input
                      id="price_half"
                      type="number"
                      step="0.01"
                      value={foodItemForm.price_half_tray}
                      onChange={(e) => setFoodItemForm({...foodItemForm, price_half_tray: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_quarter">Quarter Tray Price ($)</Label>
                    <Input
                      id="price_quarter"
                      type="number"
                      step="0.01"
                      value={foodItemForm.price_quarter_tray}
                      onChange={(e) => setFoodItemForm({...foodItemForm, price_quarter_tray: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={foodItemForm.is_vegetarian}
                      onChange={(e) => setFoodItemForm({...foodItemForm, is_vegetarian: e.target.checked})}
                    />
                    <span>Vegetarian</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={foodItemForm.is_vegan}
                      onChange={(e) => setFoodItemForm({...foodItemForm, is_vegan: e.target.checked})}
                    />
                    <span>Vegan</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={foodItemForm.is_available}
                      onChange={(e) => setFoodItemForm({...foodItemForm, is_available: e.target.checked})}
                    />
                    <span>Available</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Add Food Item</Button>
                  <Button type="button" variant="outline" onClick={() => setShowFoodItemForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuManager;
