
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  event_id: string;
  provider_id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email: string;
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select(`
        *,
        customer:profiles!orders_customer_id_fkey(name, email)
      `);

      // If user is a provider, filter orders for their business
      if (user) {
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (providerData) {
          query = query.eq('provider_id', providerData.id);
        } else {
          // If not a provider, show orders for this customer
          query = query.eq('customer_id', user.id);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to ensure customer is properly typed
      const transformedData = (data || []).map(order => {
        const customerData = order.customer;
        return {
          ...order,
          customer: customerData && 
                    typeof customerData === 'object' && 
                    customerData !== null &&
                    'name' in customerData
            ? {
                name: (customerData as any).name || 'Unknown',
                email: (customerData as any).email || 'Unknown'
              }
            : undefined
        };
      });

      setOrders(transformedData);
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

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, ...data } : order
      ));

      toast({
        title: "Success!",
        description: "Order status updated successfully"
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
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
