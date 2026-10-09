import { auth } from "../../lib/auth";

const loginUser = async (payload) => {
  const response = await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  });

  return response;
};

export const AuthService = {
  loginUser,
};