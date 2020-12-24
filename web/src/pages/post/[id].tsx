import { Box, Flex, Heading } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPost } from '../../utils/useGetPost';

const Post = ({}) => {
  const { data, loading } = useGetPost();

  if (!data?.post) {
    return <Layout>could not find post</Layout>;
  }

  return (
    <Layout>
      <Flex direction="row" align="center" mb={4}>
        <Box>
          <Heading>{data.post.title}</Heading>
          <Box color="gray.500">author: {data.post.creator.username}</Box>
        </Box>
        <Box ml="auto">
          <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          />
        </Box>
      </Flex>

      <Box>{data.post.text}</Box>
    </Layout>
  );
};

export default Post;
