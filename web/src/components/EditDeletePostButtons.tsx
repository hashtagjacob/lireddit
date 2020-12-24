import { Box, IconButton, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data: me } = useMeQuery();

  if (me?.me?.id !== creatorId) {
    return null;
  }
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton mr={4} as={Link} icon="edit" aria-label="Edit post" />
      </NextLink>

      <IconButton
        icon="delete"
        aria-label="Delete post"
        onClick={() => deletePost({ variables: { id } })}
      />
    </Box>
  );
};
