
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  event_id: string;
  cart_id?: string;
  primary_provider_id?: string;
  backup_provider_id?: string;
  customer_id: string;
  provider_id: string;
  total_amount: number;
  total_price_primary?: number;
  total_price_backup?: number;
  order_status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email: string;
  };
  event?: {
    name: string;
    date: string;
    location: string;
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select(`
        *,
        event:events(name, date, location),
        customer:profiles!orders_customer_id_fkey(name, email)
      `);

      // Filter based on user role
      if (profile?.role === 'restaurant' || profile?.role === 'caterer') {
        // Get provider data for current user
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (providerData) {
          query = query.or(`primary_provider_id.eq.${providerData.id},backup_provider_id.eq.${providerData.id}`);
        }
      } else if (profile?.role === 'customer') {
        query = query.eq('customer_id', user?.id);
      }
      // Admin can see all orders (no additional filter)

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type-safe assignment with proper error handling
      const typedOrders = (data || []).map(order => ({
        ...order,
        customer: order.customer && typeof order.customer === 'object' && 'name' in order.customer ? {
          name: order.customer.name || 'Unknown',
          email: order.customer.email || 'No email'
        } : { name: 'Unknown', email: 'No email' }
      })) as Order[];

      setOrders(typedOrders);
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

  const updateOrderStatus = async (orderId: string, status: 'confirmed' | 'declined') => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, order_status: status } : order
      ));

      toast({
        title: "Success!",
        description: `Order ${status} successfully`
      });

      // If declined and there's a backup provider, create new order for backup
      if (status === 'declined') {
        const declinedOrder = orders.find(o => o.id === orderId);
        if (declinedOrder?.backup_provider_id) {
          await createBackupOrder(declinedOrder);
        }
      }

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

  const createBackupOrder = async (originalOrder: Order) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          event_id: originalOrder.event_id,
          cart_id: originalOrder.cart_id,
          customer_id: originalOrder.customer_id,
          provider_id: originalOrder.backup_provider_id!,
          primary_provider_id: originalOrder.backup_provider_id,
          total_amount: originalOrder.total_price_backup || 0,
          order_status: 'pending' as const
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Backup Order Created",
        description: "Order has been sent to backup provider"
      });

      // Refresh orders to show the new backup order
      fetchOrders();
      
      return data;
    } catch (error) {
      console.error('Error creating backup order:', error);
      toast({
        title: "Error",
        description: "Failed to create backup order",
        variant: "destructive"
      });
      return null;
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Order created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, profile]);

  return {
    orders,
    loading,
    updateOrderStatus,
    createOrder,
    refetch: fetchOrders
  };
};
