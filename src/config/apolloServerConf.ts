import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { Request, Response } from "express";
import { buildSchema } from "type-graphql";

import { UserResolver } from "../resolvers/UserResolver";
import { MoviesResolver } from "../resolvers/MoviesResolver";
import { FavouriteMoviesResolver } from "../resolvers/FavouriteMoviesResolver";
import broker from "./broker";
import { customAuthChecker } from "../utils/checker";
import { AUTH } from "../utils/checkUser";
import { loggerInstance as log } from "./logger";

const apolloServerConf = async () => {
  const schema = await buildSchema({
    authChecker: customAuthChecker,
    resolvers: [UserResolver, MoviesResolver, FavouriteMoviesResolver],
  });
  return {
    introspection: true,
    schema,
    formatError: (error: any) => {
      const {
        message,
        code: statusCode,
        type,
        data,
        stack,
      } = error.originalError;
      const isProduction = /^prod/.test(String(process.env.NODE_ENV));
      return {
        message,
        statusCode,
        type,
        data: isProduction ? null : data,
        stack: isProduction ? null : stack,
      };
    },

    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          "editor.theme": "dark",
          "request.credentials": "include",
          "editor.fontSize": 12,
          "schema.polling.interval": 60000, //1 minute
          "schema.polling.enable": true,
        },
      }),
    ],

    context: async ({ req, res }: { req: Request; res: Response }) => {
      const user = await AUTH(req, broker);
      return {
        req,
        res,
        broker,
        user,
        log,
      };
    },
  };
};
export default apolloServerConf;
