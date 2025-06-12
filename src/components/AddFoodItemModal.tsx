
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useFoodItems } from "@/hooks/useFoodItems";

interface AddFoodItemModalProps {
  open: boolean;
  onClose: () => void;
  menuId?: string;
}

const AddFoodItemModal: React.FC<AddFoodItemModalProps> = ({ open, onClose, menuId }) => {
  const { createFoodItem } = useFoodItems();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: '',
    category: 'veg' as const,
    price_full_tray: '',
    price_half_tray: '',
    price_quarter_tray: '',
    tray_size: 'Available in multiple sizes',
    is_vegetarian: false,
    is_vegan: false,
    is_available: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cuisine_type || !formData.price_full_tray || !formData.price_half_tray || !formData.price_quarter_tray) {
      return;
    }

    setLoading(true);
    
    const success = await createFoodItem({
      menu_id: menuId,
      name: formData.name,
      description: formData.description,
      cuisine_type: formData.cuisine_type,
      category: formData.category,
      price_full_tray: parseFloat(formData.price_full_tray),
      price_half_tray: parseFloat(formData.price_half_tray),
      price_quarter_tray: parseFloat(formData.price_quarter_tray),
      tray_size: formData.tray_size,
      is_vegetarian: formData.is_vegetarian,
      is_vegan: formData.is_vegan,
      is_available: formData.is_available
    });

    setLoading(false);

    if (success) {
      setFormData({
        name: '',
        description: '',
        cuisine_type: '',
        category: 'veg' as const,
        price_full_tray: '',
        price_half_tray: '',
        price_quarter_tray: '',
        tray_size: 'Available in multiple sizes',
        is_vegetarian: false,
        is_vegan: false,
        is_available: true
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Add a new item to your catering menu
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Butter Chicken"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine_type">Cuisine Type *</Label>
              <Input
                id="cuisine_type"
                placeholder="e.g., North Indian"
                value={formData.cuisine_type}
                onChange={(e) => setFormData(prev => ({ ...prev, cuisine_type: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your dish..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                <SelectItem value="halal">Halal</SelectItem>
                <SelectItem value="jain">Jain</SelectItem>
                <SelectItem value="kosher">Kosher</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_full_tray">Full Tray Price ($) *</Label>
              <Input
                id="price_full_tray"
                type="number"
                step="0.01"
                placeholder="e.g., 250"
                value={formData.price_full_tray}
                onChange={(e) => setFormData(prev => ({ ...prev, price_full_tray: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_half_tray">Half Tray Price ($) *</Label>
              <Input
                id="price_half_tray"
                type="number"
                step="0.01"
                placeholder="e.g., 150"
                value={formData.price_half_tray}
                onChange={(e) => setFormData(prev => ({ ...prev, price_half_tray: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_quarter_tray">Quarter Tray Price ($) *</Label>
              <Input
                id="price_quarter_tray"
                type="number"
                step="0.01"
                placeholder="e.g., 80"
                value={formData.price_quarter_tray}
                onChange={(e) => setFormData(prev => ({ ...prev, price_quarter_tray: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_vegetarian"
                checked={formData.is_vegetarian}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_vegetarian: !!checked }))}
              />
              <Label htmlFor="is_vegetarian">Vegetarian</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_vegan"
                checked={formData.is_vegan}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_vegan: !!checked }))}
              />
              <Label htmlFor="is_vegan">Vegan</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: !!checked }))}
              />
              <Label htmlFor="is_available">Available</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodItemModal;
