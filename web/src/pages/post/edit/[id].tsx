import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import useGetIntId from '../../../utils/useGetIntId';

const EditPost: React.FC<{}> = ({}) => {
  const id = useGetIntId();
  const { loading, data } = usePostQuery({ variables: { id } });
  const [updatePost] = useUpdatePostMutation();
  const router = useRouter();

  if (loading) {
    return <Layout>loading...</Layout>;
  }

  if (!data?.post) {
    return <Layout>error - could not load your post</Layout>;
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          const response = await updatePost({ variables: { id, ...values } });
          if (!response.errors) {
            router.back();
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
              save changes
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditPost;
