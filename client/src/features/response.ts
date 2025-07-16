export type LoginResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
};
