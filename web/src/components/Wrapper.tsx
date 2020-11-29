import { Box } from '@chakra-ui/core';
import React from 'react';

export type WrapperVariant = 'regular' | 'small';

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    <Box
      mx='auto'
      mt={8}
      maxW={variant === 'regular' ? '800px' : '400px'}
      w='100%'
    >
      {children}
    </Box>
  );
};
