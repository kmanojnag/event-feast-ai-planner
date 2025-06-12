
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  event_id: string;
  cart_id?: string;
  customer_id: string;
  provider_id: string;
  primary_provider_id?: string;
  backup_provider_id?: string;
  total_amount: number;
  total_price_primary?: number;
  total_price_backup?: number;
  order_status?: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  status: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  event?: {
    name: string;
    date: string;
    location: string;
    guest_count: number;
  };
  customer?: {
    name: string;
    email: string;
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchOrders = async () => {
    if (!user || !profile) return;
    
    try {
      let query = supabase.from('orders').select(`
        *,
        event:events(name, date, location, guest_count),
        customer:profiles!orders_customer_id_fkey(name, email)
      `);

      // Filter based on user role
      if (profile.role === 'customer') {
        query = query.eq('customer_id', user.id);
      } else if (profile.role === 'restaurant' || profile.role === 'caterer') {
        // Get orders for this provider
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (providerData) {
          query = query.or(`provider_id.eq.${providerData.id},primary_provider_id.eq.${providerData.id},backup_provider_id.eq.${providerData.id}`);
        }
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (
    eventId: string,
    cartId: string,
    primaryProviderId: string,
    backupProviderId?: string,
    totalPrimary: number = 0,
    totalBackup: number = 0,
    specialInstructions?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          event_id: eventId,
          cart_id: cartId,
          customer_id: user.id,
          provider_id: primaryProviderId,
          primary_provider_id: primaryProviderId,
          backup_provider_id: backupProviderId,
          total_amount: totalPrimary,
          total_price_primary: totalPrimary,
          total_price_backup: totalBackup,
          order_status: 'pending',
          status: 'pending',
          special_instructions: specialInstructions
        }])
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      toast({
        title: "Order placed!",
        description: "Your order has been submitted for review"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'confirmed' | 'declined') => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          order_status: status,
          status: status 
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(order => order.id === orderId ? data : order));
      
      toast({
        title: "Order updated",
        description: `Order has been ${status}`
      });
      
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, profile]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
