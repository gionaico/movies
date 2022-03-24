"use strict";
// const DbService = require("moleculer-db");
import { Errors, ServiceSchema } from "moleculer";
import * as DbService from "moleculer-db";
// import * as jwt from "jsonwebtoken";
// import * as bcrypt from "bcrypt";
import { Users as User } from "../models/User";
import { Movie } from "../models/Movie";
import { Favouritemovies } from "../models/FavouriteMovies";
import db_connection from "../config/db-connection";
import handlerAuthError from "./hooks/auth.error.hook ";
// const { AuthenticationError } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AUTH: ServiceSchema = {
  name: "auth",
  model: User,
  mixins: [DbService],
  adapter: db_connection(String(process.env.DB_NAME), [
    User,
    Movie,
    Favouritemovies,
  ]),
  settings: {
    /** Secret for BCRYPT */
    BCRYPT_SALT_ROUNDS: parseInt(String(process.env.BCRYPT_SALT_ROUNDS || 10)),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: 60 * 60, //seconds
    JWT_REFRESH_TIME: 60 * 15, //seconds
  },

  created() {
    this.bcrypt = bcrypt;
    this.jwt = jwt;
  },

  hooks: {
    error: { ...handlerAuthError },
  },

  actions: {
    //call PANEL_AUTH.VERIFY_TOKEN --token
    verify_token: {
      cache: false,
      params: {
        token: { type: "string", optional: false },
      },
      handler(ctx: any) {
        const token: any = this.jwt.verify(
          ctx.params.token,
          this.settings.JWT_SECRET,
          (error: any, decoded: any) => {
            let result = decoded;
            if (error) {
              throw new Errors.MoleculerError("TOKEN NO VALID", 401, "", [
                {
                  field: "username",
                  message: "Token no valid.",
                  msg: error,
                },
              ]);
            }
            const info_decoded = { ...decoded };
            const today_in_seconds = Math.round(Date.now() / 1000);

            if (
              today_in_seconds + this.settings.JWT_REFRESH_TIME >=
              info_decoded.exp
            ) {
              result = this.transformEntity(
                {
                  usuario: info_decoded.usuario,
                  permisos: info_decoded.permisos,
                },
                true
              );
            }
            return result;
          }
        );
        return token;
      },
    },

    //call PANEL_AUTH.LOGIN --username giovanny --password a123456789a
    login: {
      cache: false,
      params: {
        username: {
          type: "string",
          optional: false,
          trim: true,
          lowercase: true,
        },
        password: {
          type: "string",
          optional: false,
          trim: true,
        },
      },
      async handler(ctx) {
        let msg_error = "";
        let { username, password } = ctx.params;
        const user_data: User = await this.adapter.repository
          .createQueryBuilder()
          .where({ username })
          .getOne();

        if (!user_data) {
          msg_error = `User "${username}" no exist`;
          throw new Errors.MoleculerError(msg_error, 401, "", {
            username,
            msg: msg_error,
          });
        }

        const correct_password = this.bcrypt.compareSync(
          password,
          user_data.password
        );

        if (!correct_password) {
          msg_error = "Incorrect Password";
          throw new Errors.MoleculerError(msg_error, 401, "", {
            username,
            msg: msg_error,
          });
        }

        const user_with_token = await this.transformEntity(
          { username: user_data.username },
          true
        );

        return user_with_token;
      },
    },
    //call PANEL_AUTH.REGISTER --username giovanny --password a123456789a
    register: {
      cache: false,
      params: {
        username: {
          type: "string",
          optional: false,
          trim: true,
          lowercase: true,
        },
        password: {
          type: "string",
          optional: false,
          trim: true,
        },
      },
      async handler(ctx) {
        const { username, password } = ctx.params;
        const user_exist = await this.adapter.connection
          .createQueryBuilder()
          .from(User)
          .where("username = :username", { username: username })
          .getRawOne();

        if (user_exist) {
          throw new Errors.MoleculerError("register", 401, "action", {
            key: "action",
            msg: `The user ${username} already exist.`,
          });
        }

        const hash = this.bcrypt.hashSync(
          password,
          this.settings.BCRYPT_SALT_ROUNDS
        );
        await this.adapter.repository.insert({
          username,
          password: hash,
        });
        /* const insert = await this.adapter.connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([{ username, password: hash }])
            .execute(); */
        /* const user = await this.adapter.repository.save({
            username,
            password: hash,
          }); */

        return { username };
      },
    },
  },
  methods: {
    generateJWT(user: User) {
      return this.jwt.sign(user, this.settings.JWT_SECRET, {
        expiresIn: this.settings.JWT_EXPIRE,
      });
    },

    transformEntity(user: User, withToken: Boolean, token: string) {
      let result: UserWithToken = user;
      if (withToken) result.token = token || this.generateJWT(user);
      return result;
    },
  },
};
export = AUTH;

interface UserWithToken extends User {
  token?: string;
}
