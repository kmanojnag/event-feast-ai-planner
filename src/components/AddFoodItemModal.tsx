
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
}

const AddFoodItemModal: React.FC<AddFoodItemModalProps> = ({ open, onClose }) => {
  const { createFoodItem } = useFoodItems();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: '',
    price_per_tray: '',
    tray_size: '',
    is_vegetarian: false,
    is_vegan: false,
    is_available: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cuisine_type || !formData.price_per_tray || !formData.tray_size) {
      return;
    }

    setLoading(true);
    
    const success = await createFoodItem({
      name: formData.name,
      description: formData.description,
      cuisine_type: formData.cuisine_type,
      price_per_tray: parseFloat(formData.price_per_tray),
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
        price_per_tray: '',
        tray_size: '',
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
              <Select value={formData.cuisine_type} onValueChange={(value) => setFormData(prev => ({ ...prev, cuisine_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="continental">Continental</SelectItem>
                  <SelectItem value="fusion">Fusion</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_tray">Price per Tray (₹) *</Label>
              <Input
                id="price_per_tray"
                type="number"
                placeholder="e.g., 2500"
                value={formData.price_per_tray}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_tray: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tray_size">Tray Size *</Label>
              <Input
                id="tray_size"
                placeholder="e.g., Serves 10-12 people"
                value={formData.tray_size}
                onChange={(e) => setFormData(prev => ({ ...prev, tray_size: e.target.value }))}
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
