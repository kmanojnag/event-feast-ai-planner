
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: string;
  cart_id: string;
  food_item_id: string;
  tray_size: 'full' | 'half' | 'quarter';
  quantity: number;
  provider_id: string;
  is_backup_provider: boolean;
  price: number;
  created_at: string;
  food_item?: {
    name: string;
    description?: string;
  };
  provider?: {
    name: string;
  };
}

export interface Cart {
  id: string;
  event_id: string;
  customer_id: string;
  created_at: string;
  items: CartItem[];
}

export const useCart = (eventId?: string) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user || !eventId) return;
    
    try {
      // Get or create cart for this event
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('event_id', eventId)
        .eq('customer_id', user.id)
        .single();

      if (cartError && cartError.code === 'PGRST116') {
        // Cart doesn't exist, create one
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert([{ event_id: eventId, customer_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;
        cartData = newCart;
      } else if (cartError) {
        throw cartError;
      }

      // Fetch cart items with related data
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          food_item:food_items(name, description),
          provider:providers(name)
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) throw itemsError;

      setCart({
        ...cartData,
        items: items || []
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    foodItemId: string,
    traySize: 'full' | 'half' | 'quarter',
    quantity: number,
    providerId: string,
    price: number,
    isBackupProvider: boolean = false
  ) => {
    if (!cart) return null;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          cart_id: cart.id,
          food_item_id: foodItemId,
          tray_size: traySize,
          quantity,
          provider_id: providerId,
          price,
          is_backup_provider: isBackupProvider
        }])
        .select(`
          *,
          food_item:food_items(name, description),
          provider:providers(name)
        `)
        .single();

      if (error) throw error;

      setCart(prev => prev ? {
        ...prev,
        items: [...prev.items, data]
      } : null);

      toast({
        title: "Added to cart!",
        description: `${data.food_item?.name} (${traySize} tray) added to cart`
      });
      
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
      return null;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCart(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      } : null);

      toast({
        title: "Removed from cart",
        description: "Item removed successfully"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)
        .select(`
          *,
          food_item:food_items(name, description),
          provider:providers(name)
        `)
        .single();

      if (error) throw error;

      setCart(prev => prev ? {
        ...prev,
        items: prev.items.map(item => item.id === itemId ? data : item)
      } : null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const getCartTotals = () => {
    if (!cart) return { primary: 0, backup: 0 };

    const primary = cart.items
      .filter(item => !item.is_backup_provider)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const backup = cart.items
      .filter(item => item.is_backup_provider)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { primary, backup };
  };

  useEffect(() => {
    fetchCart();
  }, [user, eventId]);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotals,
    refetch: fetchCart
  };
};
