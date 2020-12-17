import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  return (
    <Layout>
      <Stack spacing={8}>
        {data && !fetching ? (
          data.posts.posts?.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={post} />
                <Box ml={4} flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl" mr={2}>
                        {post.title}
                      </Heading>
                    </Link>
                  </NextLink>

                  <Box color="gray.400">posted by: {post.creator.username}</Box>

                  <Flex>
                    <Text mt={4}>{post.textSnippet}...</Text>
                    <Box ml="auto">
                      <EditDeletePostButtons
                        id={post.id}
                        creatorId={post.creator.id}
                      />
                    </Box>
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
            m="auto"
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
