import { Link } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../components/Layout';
import { Navbar } from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const [{ data }] = usePostsQuery();
  const router = useRouter();
  return (
    <Layout>
      <div>Hello world</div>
      <NextLink href='/create-post'>
        <Link>create post</Link>
      </NextLink>

      <br />
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
