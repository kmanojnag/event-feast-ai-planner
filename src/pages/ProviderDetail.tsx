
import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FoodItem } from "@/hooks/useFoodItems";
import { useReviews } from "@/hooks/useReviews";
import { Provider } from "@/hooks/useProviders";
import { MapPin, Star, Users, Phone, Mail, Globe, Leaf } from "lucide-react";

const ProviderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { reviews } = useReviews(id);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      if (!id) return;

      try {
        // Fetch provider details
        const { data: providerData, error: providerError } = await supabase
          .from('provider_stats')
          .select('*')
          .eq('id', id)
          .single();

        if (providerError) throw providerError;

        // Fetch additional provider info
        const { data: fullProviderData, error: fullProviderError } = await supabase
          .from('providers')
          .select('*')
          .eq('id', id)
          .single();

        if (fullProviderError) throw fullProviderError;

        setProvider({ ...providerData, ...fullProviderData });

        // Fetch food items
        const { data: foodData, error: foodError } = await supabase
          .from('food_items')
          .select('*')
          .eq('provider_id', id)
          .eq('is_available', true);

        if (foodError) throw foodError;
        setFoodItems(foodData || []);
      } catch (error) {
        console.error('Error fetching provider details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider not found</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Provider Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                  {provider.image_url ? (
                    <img 
                      src={provider.image_url} 
                      alt={provider.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">🍽️</div>
                      <p className="text-gray-600">No image</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{provider.provider_type.replace('_', ' ')}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{provider.average_rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-gray-500 ml-1">({provider.review_count || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {provider.description && (
                  <p className="text-gray-600 mb-4">{provider.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {provider.location}
                  </div>
                  {provider.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {provider.phone}
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {provider.email}
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {provider.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items ({foodItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {foodItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No menu items available</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {foodItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-green-600">₹{item.price_per_tray}</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              {item.tray_size}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="outline" className="text-xs">{item.cuisine_type}</Badge>
                            {item.is_vegetarian && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                <Leaf className="h-3 w-3 mr-1" />
                                Veg
                              </Badge>
                            )}
                            {item.is_vegan && (
                              <Badge variant="outline" className="text-xs text-green-700 border-green-700">
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
