import React from 'react';
import { Flex, useBreakpointValue, Box, Spacer, IconButton } from '@chakra-ui/react';
import { CartProductMeta } from './CartProductMeta';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { removeItemFromCart, updateCartItem } from '../slices/cartSlices';

export const CartItem = (props) => {
  const {
    item, // Assume item prop contains cart item details
    onDelete
  } = props;

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeItemFromCart({ id: item.Product.id }));
    if (onDelete) onDelete(); // If additional delete handling is needed
  };
  // Handle quantity changes
  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(updateCartItem({ ...item, quantity: newQuantity }));
  };


  // Responsive layout adjustments
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" position="relative">
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete item"
        onClick={handleDelete}
        position="absolute"
        top="2"
        right="2"
      />
      <Flex direction={flexDirection}>
        <CartProductMeta item={item} onQuantityChange={handleQuantityChange} />
        <Spacer />
      </Flex>
    </Box>
  );
};