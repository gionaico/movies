"use strict";
import { TypeOrmDbAdapter } from "./adapter";

const db_connection = (
  database: string,
  entities: any[] = [],
  sync: boolean = false,
  dropSchema: boolean = false, //Vacia la DB
  type: any = process.env.DB_TYPE
) => {
  try {
  /*   console.log({
      database,
      entities,
      sync,
      dropSchema,
      type,
    }); */
    const adapter = new TypeOrmDbAdapter({
      name: database + "-" + Math.random(),
      type: type,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: parseInt(String(process.env.DB_PORT)),
      synchronize: process.env.NODE_ENV === "prod" ? false : sync,
      logging: /^prod/.test(String(process.env.NODE_ENV)), //process.env.DEV_LOG ? true : false,
      database: database,
      entities: entities,
      options: {
        useUTC: false,
      },
    });

    return adapter;
  } catch (err) {
    console.error(`Problems with db connection: ${database}`);
  }
};

export default db_connection;
