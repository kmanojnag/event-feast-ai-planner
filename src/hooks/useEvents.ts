
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Event {
  id: string;
  user_id: string;
  name: string;
  date: string;
  location: string;
  guest_count: number;
  cuisine_type: string;
  budget?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data]);
      toast({
        title: "Success!",
        description: "Event created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return {
    events,
    loading,
    createEvent,
    refetch: fetchEvents
  };
};
