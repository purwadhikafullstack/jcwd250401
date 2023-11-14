import React, { useState, useEffect } from 'react';
import { VStack, HStack, Image, Text, useColorModeValue as mode, Button, Input } from '@chakra-ui/react';
import { PriceTag } from './PriceTag';

export const CartProductMeta = ({ item, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity); // Update local state when item.quantity changes
  }, [item.quantity]);

  const incrementQuantity = () => {
    const newQuantity = quantity < item.stock ? quantity + 1 : quantity;
    setQuantity(newQuantity);
    onQuantityChange(item.id, newQuantity);
  };

  const decrementQuantity = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : quantity;
    setQuantity(newQuantity);
    onQuantityChange(item.id, newQuantity);
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= item.stock) {
      setQuantity(value);
      onQuantityChange(item.id, value);
    }
  };

  return (
    <HStack spacing="5" width="full" alignItems="start">
      <Image
        rounded="lg"
        width="120px"
        height="120px"
        fit="cover"
        src={item.Product.image}
        alt={item.Product.name}
      />
      <VStack alignItems="start" spacing="1">
        <Text fontWeight="bold" fontSize="lg">{item.Product.name}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">SKU: {item.Product.id}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">Desc: {item.Product.description}</Text>
        <PriceTag price={item.Product.price} currency="IDR" />
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