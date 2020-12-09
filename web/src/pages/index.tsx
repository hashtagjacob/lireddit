import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Navbar } from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { UpdootSection } from '../components/UpdootSection';

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  // const router = useRouter();
  return (
    <Layout>
      <Flex align='center'>
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>create post</Link>
        </NextLink>
      </Flex>
      <br />
      <Stack spacing={8}>
        {data && !fetching ? (
          data.posts.posts?.map((post) => (
            <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
              <UpdootSection post={post} />
              <Box ml={4}>
                <Heading fontSize='xl' mr={2}>
                  {post.title}
                </Heading>{' '}
                <Box color='gray.400'>posted by: {post.creator.username}</Box>
                <Text mt={4}>{post.textSnippet}...</Text>
              </Box>
            </Flex>
          ))
        ) : (
          <div>loading...</div>
        )}
      </Stack>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() =>
              setVariables({
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                limit: 10,
              })
            }
            isLoading={fetching}
            m='auto'
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
