import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRegisterMutation } from '../generated/graphql';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async ({ username, password, email }, { setErrors }) => {
          const response = await register({ username, password, email });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label='Username'
              name='username'
              placeholder='username'
            />
            <Box mt={4}>
              <InputField label='Email' name='email' placeholder='email' />
            </Box>
            <Box mt={4}>
              <InputField
                label='Password'
                name='password'
                placeholder='password'
                type='password'
              />
            </Box>
            <Button
              type='submit'
              mt={4}
              isLoading={isSubmitting}
              variantColor='teal'
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
