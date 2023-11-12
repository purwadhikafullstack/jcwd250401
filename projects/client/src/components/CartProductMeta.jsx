import {
  VStack,
  HStack,
  Image,
  Text,
  useColorModeValue as mode,
  Select
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

  return (
    <HStack spacing="5" width="full" alignItems="start">
      <Image
        rounded="lg"
        width="120px"
        height="120px"
        fit="cover"
        src={image}
        alt={name}
        draggable="false"
        loading="lazy"
      />
      <VStack alignItems="start" spacing="1">
        <Text fontWeight="medium">{name}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">SKU: {sku}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">Color: {color}</Text>
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">Size: {size}</Text>
        <PriceTag price={price} currency="IDR" />
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">Quantity:</Text>
        {/* Quantity Dropdown */}
        <Select value={quantity} onChange={(e) => onQuantityChange(sku, e.target.value)} width="auto">
          {[...Array(stock).keys()].map(num => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </Select>
      </VStack>
    </HStack>
  );
};
