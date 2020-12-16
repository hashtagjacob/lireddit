import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetPost } from '../../../utils/useGetPost';

const EditPost: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useGetPost();
  const [{}, updatePost] = useUpdatePostMutation();
  const router = useRouter();

  if (fetching) {
    return <Layout>loading...</Layout>;
  }

  if (!data?.post) {
    return <Layout>error - could not load your post</Layout>;
  }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          const response = await updatePost({ id: data.post!.id, ...values });
          console.log(response);
          if (!response.error) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label='Post title'
              name='title'
              placeholder='title of your post'
            />
            <Box mt={4}>
              <InputField
                textarea
                label='Body'
                name='text'
                placeholder='text...'
              />
            </Box>
            <Button
              type='submit'
              mt={4}
              isLoading={isSubmitting}
              variantColor='teal'
            >
              save changes
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
