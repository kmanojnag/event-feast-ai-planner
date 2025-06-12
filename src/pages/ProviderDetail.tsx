
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, Globe, Leaf, Users } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  description: string;
  location: string;
  provider_type: string;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
}

interface FoodItem {
  id: string;
  name: string;
  description?: string;
  cuisine_type: string;
  price_full_tray: number;
  price_half_tray: number;
  price_quarter_tray: number;
  tray_size: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_available: boolean;
  category: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  customer: {
    name: string;
  };
  created_at: string;
}

const ProviderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProviderDetails = async () => {
      if (!id) return;

      try {
        // Fetch provider details
        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .select('*')
          .eq('id', id)
          .single();

        if (providerError) throw providerError;
        setProvider(providerData);

        // Fetch food items for this provider
        const { data: foodItemsData, error: foodItemsError } = await supabase
          .from('food_items')
          .select('*')
          .eq('provider_id', id)
          .eq('is_available', true);

        if (foodItemsError) throw foodItemsError;
        setFoodItems(foodItemsData || []);

        // Fetch reviews for this provider
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            customer:profiles!reviews_customer_id_fkey(name)
          `)
          .eq('provider_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);

      } catch (error) {
        console.error('Error fetching provider details:', error);
        toast({
          title: "Error",
          description: "Failed to load provider details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Provider not found</h2>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Provider Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{provider.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                  <Badge variant="outline">{provider.provider_type.replace('_', ' ')}</Badge>
                </div>
                
                <p className="text-gray-600 mb-6">{provider.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    {provider.location}
                  </div>
                  {provider.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3" />
                      {provider.phone}
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-5 w-5 mr-3" />
                      {provider.email}
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 mr-3" />
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                        {provider.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-gray-600">Restaurant Image</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
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
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.customer?.name || 'Anonymous'}</span>
                      <span className="text-gray-500 ml-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDetail;
