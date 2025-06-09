
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, DollarSign, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { useNavigate } from "react-router-dom";

const PlanEvent = () => {
  const { toast } = useToast();
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    location: '',
    guest_count: '',
    cuisine_type: '',
    budget: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.name || !eventData.date || !eventData.location || !eventData.guest_count || !eventData.cuisine_type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const event = await createEvent({
      name: eventData.name,
      date: eventData.date,
      location: eventData.location,
      guest_count: parseInt(eventData.guest_count),
      cuisine_type: eventData.cuisine_type,
      budget: eventData.budget ? parseFloat(eventData.budget) : undefined
    });

    setLoading(false);

    if (event) {
      toast({
        title: "Event Created!",
        description: "Your event has been created successfully. Now let's find caterers for you!"
      });
      navigate(`/event/${event.id}/browse-providers`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-xl border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Plan Your Event</CardTitle>
            <CardDescription>Tell us about your event and we'll help you find perfect caterers</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Wedding Reception, Birthday Party"
                  value={eventData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      value={eventData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest_count">Number of Guests *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="guest_count"
                      type="number"
                      placeholder="e.g., 50"
                      className="pl-10"
                      value={eventData.guest_count}
                      onChange={(e) => handleInputChange('guest_count', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Enter city or venue address"
                    className="pl-10"
                    value={eventData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine_type">Preferred Cuisine *</Label>
                <Select value={eventData.cuisine_type} onValueChange={(value) => handleInputChange('cuisine_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="continental">Continental</SelectItem>
                    <SelectItem value="fusion">Fusion</SelectItem>
                    <SelectItem value="local">Local Specialties</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter your budget in ₹"
                    className="pl-10"
                    value={eventData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">This helps us show options within your range</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? 'Creating Event...' : 'Create Event & Find Caterers'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanEvent;
