import { googleLogin, loginUser, registerUser } from "@/lib/auth/api";

import { useMutation } from "@tanstack/react-query";

export const useRegister = () =>
  useMutation({
    mutationFn: registerUser,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: loginUser,
  });

 export const useGoogleLogin = () => {
  return useMutation({ mutationFn: googleLogin });
};
