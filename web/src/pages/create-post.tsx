import { Box, Flex, Link, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  useIsAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({ variables: { input: values } });
          if (!response.errors) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Post title"
              name="title"
              placeholder="title of your post"
            />
            <Box mt={4}>
              <InputField
                textarea
                label="Body"
                name="text"
                placeholder="text..."
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              variantColor="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
