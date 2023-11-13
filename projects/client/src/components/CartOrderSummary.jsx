import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import { formatPrice } from './PriceTag'

const OrderSummaryItem = (props) => {
  const { label, value, children } = props
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  )
}

export const CartOrderSummary = ({ cartItems }) => {
  // Check if cartItems is defined and is an array
  const subtotal = Array.isArray(cartItems) ? cartItems.reduce((total, item) => {
    return total + (item.quantity * item.Product.price);
  }, 0) : 0;
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax; // Total is subtotal plus tax
  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Heading size="md">Order Summary</Heading>

      <Stack spacing="6">
        <OrderSummaryItem label="Item(s) Subtotal" value={formatPrice(subtotal)} />
        <OrderSummaryItem label="Tax" value={formatPrice(tax)} />
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Subtotal
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {formatPrice(total)}
          </Text>
        </Flex>
      </Stack>
      <Button
        color="white"
        bg="black"
        _hover={{ bg: 'black' }}
        size="lg"
        fontSize="md"
        rightIcon={<FaArrowRight />}
      >
        Checkout
      </Button>
    </Stack>
  )
}
