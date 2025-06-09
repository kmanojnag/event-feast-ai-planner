
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Calendar, DollarSign, Star, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PlanEvent = () => {
  const { toast } = useToast();
  const [eventDetails, setEventDetails] = useState({
    guests: '',
    cuisine: '',
    location: '',
    date: '',
    eventType: '',
    budget: '',
    specialRequirements: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setEventDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Event Details Saved!",
        description: "Finding the best caterers for your event...",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your event</h2>
              <p className="text-gray-600">We'll use this information to find perfect matches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="guests"
                    placeholder="e.g., 50"
                    className="pl-10"
                    value={eventDetails.guests}
                    onChange={(e) => handleInputChange('guests', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventDetails.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="festival">Festival Celebration</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={eventDetails.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Enter city or area"
                    className="pl-10"
                    value={eventDetails.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cuisine & Budget Preferences</h2>
              <p className="text-gray-600">Help us personalize your recommendations</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cuisine">Preferred Cuisine</Label>
                <Select value={eventDetails.cuisine} onValueChange={(value) => handleInputChange('cuisine', value)}>
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
                    placeholder="Enter your budget in ₹"
                    className="pl-10"
                    value={eventDetails.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">This helps us show options within your range</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any dietary restrictions, special requests, or additional details..."
                  value={eventDetails.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect! Here's what we found</h2>
              <p className="text-gray-600">Top-rated caterers matching your requirements</p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  name: "Spice Garden Catering",
                  type: "Restaurant",
                  rating: 4.8,
                  price: "₹450/person",
                  specialties: ["Indian", "North Indian", "Vegetarian"],
                  minOrder: "50 people",
                  deliveryTime: "2-3 hours"
                },
                {
                  name: "Royal Kitchen Services",
                  type: "Independent Caterer",
                  rating: 4.9,
                  price: "₹380/person",
                  specialties: ["Indian", "Continental", "Live Counters"],
                  minOrder: "30 people",
                  deliveryTime: "3-4 hours"
                },
                {
                  name: "Cloud Feast",
                  type: "Cloud Kitchen",
                  rating: 4.6,
                  price: "₹320/person",
                  specialties: ["Fusion", "Multi-cuisine", "Quick Service"],
                  minOrder: "25 people",
                  deliveryTime: "1-2 hours"
                }
              ].map((caterer, index) => (
                <Card key={index} className="border-2 hover:border-orange-200 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{caterer.name}</h3>
                        <p className="text-gray-600">{caterer.type}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="font-medium">{caterer.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {caterer.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {caterer.price}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Min: {caterer.minOrder}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {caterer.deliveryTime}
                      </div>
                    </div>

                    <Button className="w-full">View Menu & Order</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-none">
          <CardContent className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {currentStep === totalSteps ? 'Start Planning' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanEvent;
