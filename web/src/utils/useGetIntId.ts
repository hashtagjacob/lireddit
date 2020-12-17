import { useRouter } from "next/router";

const useGetIntId = () : number => {
    const router = useRouter();
  const id =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    return id;
};

export default useGetIntId;