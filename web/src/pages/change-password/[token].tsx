import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword: React.FC = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async ({ newPassword }, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword,
              token:
                typeof router.query.token === 'string'
                  ? router.query.token
                  : '',
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="New Password"
              name="newPassword"
              placeholder="new password"
              type="password"
            />

            {tokenError ? (
              <Flex>
                <Box mr={1} color="red.500">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>generate new link</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              variantColor="teal"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
