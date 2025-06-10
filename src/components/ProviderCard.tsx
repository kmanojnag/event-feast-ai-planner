
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Provider } from "@/hooks/useProviders";
import { MapPin, Star, Users, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const navigate = useNavigate();

  const getProviderTypeLabel = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'Restaurant';
      case 'independent_caterer':
        return 'Independent Caterer';
      case 'cloud_kitchen':
        return 'Cloud Kitchen';
      default:
        return type;
    }
  };

  const getProviderTypeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'bg-blue-100 text-blue-800';
      case 'independent_caterer':
        return 'bg-green-100 text-green-800';
      case 'cloud_kitchen':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        {provider.image_url ? (
          <img 
            src={provider.image_url} 
            alt={provider.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <ChefHat className="h-12 w-12 text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No image</p>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{provider.name}</CardTitle>
          <Badge className={getProviderTypeColor(provider.provider_type)}>
            {getProviderTypeLabel(provider.provider_type)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {provider.location}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {provider.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">
                {provider.average_rating ? provider.average_rating.toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              {provider.review_count || 0} reviews
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {provider.food_item_count || 0} items
          </div>
        </div>
        
        <Button 
          onClick={() => navigate(`/provider/${provider.id}`)}
          className="w-full"
        >
          View Menu & Reviews
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
