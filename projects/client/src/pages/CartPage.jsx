import {
  Box,
  Flex,
  Heading,
  Stack,
} from '@chakra-ui/react'
import { CartItem } from '../components/CartItem'
import { CartOrderSummary } from '../components/CartOrderSummary'
import api from '../api'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems, removeItemFromCart, updateCartItem } from '../slices/cartSlices';  // Import Redux actions

export const CartPage = () => {
  const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/api/cart/items');
        dispatch(setCartItems(response.data.cartItems)); // Update based on API response
        console.log(response.data.cartItems);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };
    fetchCartItems();
  }, [dispatch]);

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/api/cart/items/${productId}`);
      dispatch(removeItemFromCart({ productId })); // Use productId to dispatch
    } catch (error) {
      console.error('Failed to delete the item:', error);
    }
  };
  
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      // Make API call to update quantity
      const response = await api.patch(`/api/cart/items/${productId}`, { quantity: newQuantity });
  
      // Dispatch action to update Redux store
      if (response.data && response.data.orderItem) {
        dispatch(updateCartItem(response.data.orderItem));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };  

  return ( 
   <Box
    maxW={{
      base: '3xl',
      lg: '7xl',
    }}
    mx="auto"
    px={{
      base: '4',
      md: '8',
      lg: '12',
    }}
    py={{
      base: '6',
      md: '8',
      lg: '12',
    }}
  >
    <Stack
      direction={{
        base: 'column',
        lg: 'row',
      }}
      align={{
        lg: 'flex-start',
      }}
      spacing={{
        base: '8',
        md: '16',
      }}
    >
      <Stack
        spacing={{
          base: '8',
          md: '10',
        }}
        flex="2"
      >
        <Heading fontSize="2xl" fontWeight="extrabold">
          Shopping Cart
        </Heading>

        <Stack spacing="6">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item} // Pass the entire item object
            onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
            onDelete={() => handleDelete(item.id)}
          />        
        ))}
        </Stack>
      </Stack>

      <Flex direction="column" align="center" flex="1">
        <CartOrderSummary cartItems={cartItems} />
      </Flex>
    </Stack>
  </Box>
)
}
