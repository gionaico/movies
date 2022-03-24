const { AuthenticationError } = require("apollo-server-express");

export const customAuthChecker: any = (
  { root, args, context, info }: any,
  roles: any
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  if (!context?.user?.username) {
    console.error("User no exist", { user: context.user });
    throw new AuthenticationError(`Fail auth. Please first go to login.`);
  }
  console.log("User", { user: context.user });
  return true; // or false if access is denied
};
