import React, { useContext } from 'react';
import { Box, Badge, createIcon } from '@chakra-ui/react';
import { CartContext } from './CartProvider';
import { useNavigate } from 'react-router-dom';

const CartIcon = createIcon({
  displayName: 'CartIcon',
  viewBox: '0 0 59 59',
  path: (
    <g>
      <g>
        <path style={{ fill: '#ECF0F1' }} d="M15,39.5l-5.167-27H58v23.012c0,2.202-1.785,3.988-3.988,3.988H15" />
        <path style={{ fill: '#556080' }} d="M54.013,40.5h-39.84l-5.55-29H59v24.013C59,38.263,56.763,40.5,54.013,40.5z M15.827,38.5h38.186
          C55.66,38.5,57,37.16,57,35.513V13.5H11.043L15.827,38.5z"/>
      </g>
      <g>
        <circle style={{ fill: '#FFFFFF' }} cx="22" cy="48.5" r="5" />
        <path style={{ fill: '#556080' }} d="M22,54.5c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S25.309,54.5,22,54.5z M22,44.5
          c-2.206,0-4,1.794-4,4s1.794,4,4,4s4-1.794,4-4S24.206,44.5,22,44.5z"/>
      </g>
      <g>
        <circle style={{ fill: '#FFFFFF' }} cx="45" cy="48.5" r="5" />
        <path style={{ fill: '#556080' }} d="M45,54.5c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S48.309,54.5,45,54.5z M45,44.5
          c-2.206,0-4,1.794-4,4s1.794,4,4,4s4-1.794,4-4S47.206,44.5,45,44.5z"/>
      </g>
      <path style={{ fill: '#556080' }} d="M55,48.5h-5.101c-0.553,0-1-0.447-1-1s0.447-1,1-1H55c0.553,0,1,0.447,1,1S55.553,48.5,55,48.5z"/>
      <path style={{ fill: '#556080' }} d="M40.101,48.5H26.899c-0.553,0-1-0.447-1-1s0.447-1,1-1h13.201c0.553,0,1,0.447,1,1
        S40.653,48.5,40.101,48.5z"/>
      <path style={{ fill: '#556080' }} d="M9.832,13.5c-0.48,0-0.904-0.347-0.985-0.836L8.152,8.5H6c-0.553,0-1-0.447-1-1s0.447-1,1-1h3.848
        l0.972,5.836c0.091,0.545-0.277,1.06-0.822,1.15C9.941,13.496,9.887,13.5,9.832,13.5z"/>
      <path style={{ fill: '#556080' }} d="M59,20.5h-9v-9H39v9h-7v-9H21v9H10.347l2.104,11H21v8.998l11-0.003V31.5h7v8.992l11-0.003V31.5h9
        V20.5z M41,13.5h7v7h-7V13.5z M48,22.5v7h-7v-7H48z M23,13.5h7v7h-7V13.5z M30,22.5v7h-7v-7H30z M14.104,29.5l-1.34-7H21v7H14.104z
         M30,38.495l-7,0.003V31.5h7V38.495z M32,29.5v-7h7v7H32z M48,38.489l-7,0.003V31.5h7V38.489z M57,29.5h-7v-7h7V29.5z"/>
      <path style={{ fill: '#556080' }} d="M17.101,48.5H14c-1.406,0-2.758-0.603-3.707-1.652c-0.947-1.047-1.409-2.453-1.268-3.858
        c0.255-2.518,2.522-4.489,5.163-4.489c0.553,0,1,0.447,1,1s-0.447,1-1,1c-1.627,0-3.021,1.182-3.173,2.69
        c-0.087,0.855,0.184,1.678,0.761,2.316C12.348,46.138,13.158,46.5,14,46.5h3.101c0.553,0,1,0.447,1,1S17.653,48.5,17.101,48.5z"/>
      <circle style={{ fill: '#E64C3C' }} cx="3" cy="7.5" r="3"/>
    </g>
  )
});

const CartImage = (props) => {
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();

  const handleBadgeClick = () => {
    navigate('/cart');
  }

  return (
    <Box position="relative" display="inline-block">
      {cartItemCount > 0 && (
        <Badge
          position="absolute"
          top="-1"
          right="-1"
          bg="red.500"
          color="white"
          borderRadius="full"
          fontSize="0.8em"
          px={2}
          py={1}
          onClick={() => handleBadgeClick()}
        >
          {cartItemCount}
        </Badge>
      )}
      <CartIcon boxSize={8} {...props} />
    </Box>
  );
};

export default CartImage;
