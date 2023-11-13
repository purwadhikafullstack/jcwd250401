import { Flex, useBreakpointValue, Box, Spacer, IconButton } from '@chakra-ui/react';
import { CartProductMeta } from './CartProductMeta';
import { DeleteIcon } from '@chakra-ui/icons'; // Importing DeleteIcon from Chakra UI
import { useState } from 'react';

export const CartItem = (props) => {
  const {
    name,
    imageUrl,
    price,
    sku,
    color,
    size,
    stock,
    quantity: initialQuantity,
    onQuantityChange,
    onDelete
  } = props;

  // Local state to manage the selected quantity
  const [quantity, setQuantity] = useState(initialQuantity);

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  // Responsive layout adjustments
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" position="relative">
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete item"
        onClick={onDelete}
        position="absolute"
        top="2"
        right="2"
      />
      <Flex direction={flexDirection}>
        <CartProductMeta
          image={imageUrl}
          name={name}
          sku={sku}
          color={color}
          size={size}
          price={price}
          quantity={quantity}
          stock={stock}
          onQuantityChange={handleQuantityChange}
        />
        <Spacer />
      </Flex>
    </Box>
  );
};