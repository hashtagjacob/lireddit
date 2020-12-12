import { Flex, IconButton } from '@chakra-ui/core';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  const [fetching, setFetching] = useState<
    'not-fetching' | 'updooting' | 'downdooting'
  >('not-fetching');

  return (
    <Flex direction='column' alignItems='center' justifyContent='center'>
      <IconButton
        onClick={async () => {
          setFetching('updooting');
          await vote({ value: 1, postId: post.id });
          setFetching('not-fetching');
        }}
        aria-label='updoot post'
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        icon='chevron-up'
        size='sm'
        isLoading={fetching === 'updooting'}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setFetching('downdooting');
          await vote({ value: -1, postId: post.id });
          setFetching('not-fetching');
        }}
        aria-label='downdoot post'
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        icon='chevron-down'
        size='sm'
        isLoading={fetching === 'downdooting'}
      />
    </Flex>
  );
};
