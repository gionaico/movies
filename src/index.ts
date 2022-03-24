require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import broker from "./config/broker";
import { loggerInstance as log } from "./config/logger";
import getApolloServerConf from "./config/apolloServerConf";

const cors = require("cors");
const express = require("express");
const corsOptions = {
  origin: "*",
  credentials: true,
};

async function main() {
  const app = express();
  const apolloServerConf = await getApolloServerConf();
  const server: ApolloServer = new ApolloServer(apolloServerConf);
  server.start().then(() => server.applyMiddleware({ app, cors: corsOptions }));
  app.use(cors(corsOptions));

  app.listen({ port: process.env.GRAPQL_PORT }, async () => {
    try {
      log.info(
        `🚀 ----------Server ready at http://localhost:${process.env.GRAPQL_PORT}${server.graphqlPath}`,
        {
          DB_USER: process.env.DB_USER,
          DB_PASS: process.env.DB_PASS,
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_NAME: process.env.DB_NAME,
          DB_TYPE: process.env.DB_TYPE,
          NODE_ENV: process.env.NODE_ENV,
          MOLECULER_SERIALIZER: process.env.MOLECULER_SERIALIZER,
          MOLECULER_SVC_EXTENSION: process.env.MOLECULER_SVC_EXTENSION,
          JWT_SECRET: process.env.JWT_SECRET,
          GRAPQL_PORT: process.env.GRAPQL_PORT,
        }
      );
      await broker.start();
      process.env.NODE_ENV === "prod" ? null : broker.repl();
    } catch (error) {
      log.error({ error });
    }

  });
}

main();