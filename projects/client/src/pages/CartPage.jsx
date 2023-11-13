import {
  Box,
  Flex,
  Heading,
  Stack,
} from '@chakra-ui/react'
import { CartItem } from '../components/CartItem'
import { CartOrderSummary } from '../components/CartOrderSummary'
import api from '../api'
import { useEffect, useState } from 'react'

export const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/api/cart/items');
        setCartItems(response.data.cartItems); // Update based on the API response structure
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/api/cart/items/${productId}`);
      // Update the cartItems state by filtering out the deleted item
      setCartItems(currentItems => currentItems.filter(item => item.Product.id !== productId));
    } catch (error) {
      console.error('Failed to delete the item:', error);
      // Handle any UI changes or notifications for the error
    }
  };  

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      // Make API call to update quantity
      await api.patch(`/api/cart/items/${productId}`, { newQuantity });
  
      // Update local state
      setCartItems(currentItems => currentItems.map(item => {
        if (item.Product.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Handle any UI changes or notifications for the error
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
            name={item.Product.name}
            description={item.Product.description}
            imageUrl={item.Product.imageUrl} // Assuming this exists, else provide a default or modify CartItem
            price={item.Product.price}
            currency="USD" // Assuming currency is not in API response, provide a default
            sku={item.Product.id} // Assuming you want to use Product ID as SKU
            color="Default Color" // Provide default or handle in CartItem
            size="Default Size" // Provide default or handle in CartItem
            stock={item.stock}
            quantity={item.quantity}
            // ... any other props that CartItem needs
            onQuantityChange={(newQuantity) => handleQuantityChange(item.Product.id, newQuantity)}
            onDelete={() => handleDelete(item.Product.id)}
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
