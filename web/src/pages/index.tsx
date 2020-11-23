import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Navbar } from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div>Hello world</div>
      <br />
      {data ? (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
