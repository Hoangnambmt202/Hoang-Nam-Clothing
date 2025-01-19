import { useMutation } from "@tanstack/react-query";


const useMutationHook = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
      })
      return mutation;
}

export default useMutationHook
