import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import React from 'react';
import { Provider } from 'urql';
import {
  PaginatedPosts,
  PostQueryResult,
  PostsQueryResult,
} from '../generated/graphql';
import theme from '../theme';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing, incoming) {
              // debugger;

              // const res = {
              //   posts: [...existing.posts, ...incoming.posts],
              //   hasMore: incoming.hasMore,
              // };
              console.log('existing: ', existing);
              console.log('incoming: ', incoming);
              if (!existing) {
                return incoming;
              }
              return {
                ...incoming,
                posts: [...existing.posts, ...incoming.posts],
              } as PaginatedPosts;
              // return existing;
              // console.log(res);

              // return {
              //   posts: [...existing.posts, ...incoming.posts],
              //   hasMore: incoming.hasMore,
              // } as PaginatedPosts;
            },
          },
        },
      },
    },
  }),
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
