import { Box, Flex, Heading } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPost } from '../../utils/useGetPost';

const Post = ({}) => {
  const [{ data, fetching }] = useGetPost();

  if (!data?.post) {
    return <Layout>could not find post</Layout>;
  }

  return (
    <Layout>
      <Heading>{data.post.title}</Heading>
      <Box color='gray.500'>author: {data.post.creator.username}</Box>
      {data.post.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
