
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    contact_email: '',
    phone: '',
    address: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('providers')
        .insert([{
          ...formData,
          provider_type: formData.type as 'restaurant' | 'independent_caterer' | 'cloud_kitchen',
          user_id: user.id,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${formData.type} added successfully`
      });

      // Reset form
      setFormData({
        name: '',
        type: '',
        contact_email: '',
        phone: '',
        address: '',
        description: '',
        location: ''
      });
    } catch (error) {
      console.error('Error adding provider:', error);
      toast({
        title: "Error",
        description: "Failed to add provider",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Admin Panel</CardTitle>
            <p className="text-center text-gray-600">Add new restaurants, caterers, and event planners</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Provider Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Provider Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="independent_caterer">Independent Caterer</SelectItem>
                    <SelectItem value="cloud_kitchen">Cloud Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the provider..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Provider'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
