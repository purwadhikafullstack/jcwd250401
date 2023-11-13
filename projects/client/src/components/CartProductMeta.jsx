import {
  VStack,
  HStack,
  Image,
  Text,
  useColorModeValue as mode,
  Button,
  Box
} from '@chakra-ui/react';
import { PriceTag } from './PriceTag';

export const CartProductMeta = (props) => {
  const {
    image,
    name,
    sku,
    color,
    size,
    price,
    quantity,
    stock,
    onQuantityChange
  } = props;

  // Counter control for quantity
  const incrementQuantity = () => {
    if (quantity < stock) {
      onQuantityChange(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <HStack spacing="5" width="full" alignItems="start">
      <Image
        rounded="lg"
        width="120px"
        height="120px"
        fit="cover"
        src={image}
        alt={name}
      />
      <VStack alignItems="start" spacing="1">
        <Text fontWeight="bold" fontSize="lg">{name}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">SKU: {sku}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">Color: {color}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">Size: {size}</Text>
        <PriceTag price={price} currency="IDR" />
        <HStack>
          <Button onClick={decrementQuantity}>-</Button>
          <Box as="span" px="2">{quantity}</Box>
          <Button onClick={incrementQuantity}>+</Button>
        </HStack>
      </VStack>
    </HStack>
  );
};
