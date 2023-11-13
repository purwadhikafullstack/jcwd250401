import {
  VStack,
  HStack,
  Image,
  Text,
  useColorModeValue as mode,
  Button,
  Input
} from '@chakra-ui/react';
import { PriceTag } from './PriceTag';
import { useState, useEffect } from 'react';

export const CartProductMeta = (props) => {
  const {
    image,
    name,
    sku,
    color,
    size,
    price,
    quantity: initialQuantity,
    stock,
    onQuantityChange
  } = props;

  const [quantity, setQuantity] = useState(initialQuantity);

  // Update local state when initialQuantity changes
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const incrementQuantity = () => {
    const newQuantity = quantity < stock ? quantity + 1 : quantity;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrementQuantity = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : quantity;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= stock) {
      setQuantity(value);
      onQuantityChange(value);
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
          <Input 
            type="number" 
            value={quantity} 
            onChange={handleInputChange} 
            width="50px"
            textAlign="center" 
          />
          <Button onClick={incrementQuantity}>+</Button>
        </HStack>
      </VStack>
    </HStack>
  );
};