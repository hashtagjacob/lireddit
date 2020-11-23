import { Box, Button, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching: logoutFetching }] = useMeQuery();
  const [{ fetching }, logout] = useLogoutMutation();
  let body = null;

  if (!fetching) {
    if (data?.me) {
      body = (
        <Flex>
          <Box mr={2}>{`Hello, ${data.me.username}`}</Box>
          <Button
            onClick={() => logout()}
            isLoading={logoutFetching}
            variant='link'
          >
            Log out
          </Button>
        </Flex>
      );
    } else {
      body = (
        <>
          <NextLink href='/login'>
            <Link mr={2}>login</Link>
          </NextLink>
          <NextLink href='/register'>
            <Link>register</Link>
          </NextLink>
        </>
      );
    }
  }

  return (
    <Flex bg='tan' p={3}>
      <Box ml='auto'>{body}</Box>
    </Flex>
  );
};
