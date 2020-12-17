import { useRouter } from 'next/router';
import { usePostQuery } from '../generated/graphql';
import useGetIntId from './useGetIntId';

export const useGetPost = () => {
  const id = useGetIntId();
  return usePostQuery({
    pause: id === -1,
    variables: {
      id,
    },
  });
};
