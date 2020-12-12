import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching: logoutFetching }] = useMeQuery();
  const [{ fetching }, logout] = useLogoutMutation();
  let body = null;

  if (!fetching) {
    if (data?.me) {
      body = (
        <Flex align='center'>
          <NextLink href='/create-post'>
            <Button size='sm' as={Link} mr={4}>
              create post
            </Button>
          </NextLink>
          <Box mr={4}>{`Hello, ${data.me.username}`}</Box>
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
    <Flex position='sticky' top={0} zIndex={1} bg='tan' p={3}>
      <Heading size='lg'>
        <NextLink href='/'>
          <Link>LiReddit</Link>
        </NextLink>
      </Heading>
      <Box ml='auto'>{body}</Box>
    </Flex>
  );
};
