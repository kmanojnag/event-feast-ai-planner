
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FoodItem, useFoodItems } from "@/hooks/useFoodItems";
import { Edit, Leaf, Users } from "lucide-react";

interface FoodItemCardProps {
  item: FoodItem;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item }) => {
  const { updateFoodItem } = useFoodItems();

  const handleAvailabilityToggle = async (checked: boolean) => {
    await updateFoodItem(item.id, { is_available: checked });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <p className="text-sm text-gray-600">No image</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <Switch
            checked={item.is_available}
            onCheckedChange={handleAvailabilityToggle}
          />
        </div>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg text-green-600">₹{item.price_per_tray}</span>
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
          {!item.is_available && (
            <Badge variant="destructive">Unavailable</Badge>
          )}
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default FoodItemCard;
