import { Flex, Link, Button, Select } from '@chakra-ui/react';
import { CartProductMeta } from './CartProductMeta';
import { useState, useEffect } from 'react';

export const CartItem = (props) => {
  const {
    name,
    description,
    imageUrl,
    price,
    currency,
    sku,
    color,
    size,
    stock,
    quantity,
    onQuantityChange,
    onDelete
  } = props;

  // Local state to manage the selected quantity
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);

  useEffect(() => {
    setSelectedQuantity(quantity);
  }, [quantity]);  

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setSelectedQuantity(newQuantity);
    onQuantityChange(sku, newQuantity); // Assuming SKU is used as a unique identifier
  };

  return (
    <Flex
      direction={{
        base: 'column',
        md: 'row',
      }}
      justify="space-between"
      align="center"
      position="relative"
    >
      <CartProductMeta
        name={name}
        description={description}
        image={imageUrl}
        price={price}
        currency={currency}
        sku={sku}
        color={color}
        size={size}
        stock={stock} // This should be the stock of the item
        quantity={selectedQuantity} // This should be the selected quantity
        onQuantityChange={handleQuantityChange}
      />

      {/* Delete Button */}
      <Button position="absolute" top="0" right="0" size="sm" onClick={onDelete}>
        Delete
      </Button>

      {/* Desktop */}
      <Flex
        width="full"
        justify="space-between"
        display={{
          base: 'none',
          md: 'flex',
        }}
      >
        {/* Other desktop elements if needed */}
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{
          base: 'flex',
          md: 'none',
        }}
      >
        <Link fontSize="sm" textDecor="underline" onClick={onDelete}>
          Delete
        </Link>
      </Flex>
    </Flex>
  );
};