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
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { UpdootSection } from '../components/UpdootSection';

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const [{ data: me }] = useMeQuery();
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [{}, deletePost] = useDeletePostMutation();
  return (
    <Layout>
      <Stack spacing={8}>
        {data && !fetching ? (
          data.posts.posts?.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                <UpdootSection post={post} />
                <Box ml={4} flex={1}>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize='xl' mr={2}>
                        {post.title}
                      </Heading>
                    </Link>
                  </NextLink>

                  <Box color='gray.400'>posted by: {post.creator.username}</Box>

                  <Flex>
                    <Text mt={4}>{post.textSnippet}...</Text>
                    {me?.me?.id === post.creator.id ? (
                      <Box ml='auto'>
                        <NextLink
                          href='/post/edit/[id]'
                          as={`post/edit/${post.id}`}
                        >
                          <IconButton
                            mr={4}
                            as={Link}
                            icon='edit'
                            aria-label='Edit post'
                          />
                        </NextLink>

                        <IconButton
                          icon='delete'
                          aria-label='Delete post'
                          onClick={() => deletePost({ id: post.id })}
                        />
                      </Box>
                    ) : null}
                  </Flex>
                </Box>
              </Flex>
            )
          )
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
