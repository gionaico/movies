"use strict";
// const DbService = require("moleculer-db");
import { Errors, ServiceSchema } from "moleculer";
import * as DbService from "moleculer-db";
import { Users as User } from "../models/User";
import { Movie } from "../models/Movie";
import { Favouritemovies } from "../models/FavouriteMovies";
import db_connection from "../config/db-connection";
import handlerError from "./hooks/error.hook";

const { MoleculerError } = require("moleculer").Errors;

const movie: ServiceSchema = {
  name: "movie",
  adapter: db_connection(String(process.env.DB_NAME), [
    User,
    Movie,
    Favouritemovies,
  ]),
  model: Movie,
  mixins: [DbService],
  hooks: {
    error: { ...handlerError },
  },

  actions: {
    //call movie.create --username gio --title 'Matrix', --release_date '2021-10-01'
    create: {
      cache: false,
      params: {
        username: {
          type: "string",
          optional: false,
          empty: false,
          trim: true,
          lowercase: true,
        },
        title: {
          type: "string",
          optional: false,
          trim: true,
          empty: false,
          min: 3,
          max: 15,
        },
        synopsis: {
          type: "string",
          optional: false,
          empty: false,
          trim: true,
          min: 10,
          max: 255,
        },
        release_date: {
          type: "date",
          optional: false,
        },
      },
      async handler(ctx) {
        const { username, synopsis, title, release_date } = ctx.params;
        const movie_exist = await this.getMovieByTitle(title);

        if (movie_exist)
          throw new MoleculerError(`This title already exist.`, 500, "action");

        const entity = {
          username,
          title,
          release_date,
          synopsis,
        };
        await this.adapter.repository.insert(entity);

        console.log({ entity });
        return entity;
      },
    },
    //call movie.update '{"username": "gio", "oldtitle": "Matrix", "new_entity":{"release_date": "2001-01-01","title": "Matrixx2"}}'
    update: {
      cache: false,
      params: {
        new_entity: {
          type: "object",
          props: {
            title: {
              type: "string",
              optional: true,
              trim: true,
            },
            release_date: {
              type: "date",
              optional: true,
            },
            synopsis: {
              type: "string",
              optional: true,
              empty: false,
              trim: true,
              min: 10,
              max: 255,
            },
          },
        },
        oldtitle: {
          type: "string",
          optional: false,
          trim: true,
        },
        username: {
          type: "string",
          optional: false,
          trim: true,
          lowercase: true,
        },
      },
      async handler(ctx) {
        const { oldtitle, new_entity, username } = ctx.params;
        const movie_exist = await this.getMovieByTitle(oldtitle);

        if (!movie_exist) throw new MoleculerError(`This title no exist.`);
        if (movie_exist.username != username)
          throw new MoleculerError(
            `To update this movie you must be user which created it .`
          );

        if (!Object.keys(new_entity).length)
          throw new MoleculerError(`You have not pass any field to update`);

        const entity = { ...new_entity, username };
        await this.adapter.repository
          .createQueryBuilder()
          .update(Movie)
          .set(entity)
          .where("title = :title", { title: oldtitle })
          .andWhere("username = :username", { username: username })
          .execute();

        // console.log({ save_movie, entity });
        return { ...entity, date: movie_exist.date };
      },
    },
    //call movie.delete '{"username": "gio", "title": "Matrixx2"}'
    delete: {
      cache: false,
      params: {
        title: {
          type: "string",
          optional: false,
          trim: true,
        },
        username: {
          type: "string",
          optional: false,
          trim: true,
          lowercase: true,
        },
      },
      async handler(ctx) {
        const { title, username } = ctx.params;
        const movie_exist = await this.getMovieByTitle(title);

        if (!movie_exist) throw new MoleculerError(`This title no exist.`);

        if (movie_exist.username != username)
          throw new MoleculerError(
            `To delete this movie you must be user which created it .`
          );

        await this.adapter.repository
          .createQueryBuilder()
          .delete()
          .from(Movie)
          .where("title = :title", { title: title })
          .execute();

        return movie_exist;
      },
    },
    //call movie.addToFavourite '{"username": "gio", "title": "Matrix 3"}'
    addToFavourite: {
      cache: false,
      params: {
        title: {
          type: "string",
          optional: false,
          trim: true,
        },
        username: {
          type: "string",
          optional: false,
          trim: true,
          lowercase: true,
        },
      },
      async handler(ctx) {
        const { title, username } = ctx.params;

        const [movie_exist] = await this.adapter.connection.query(
          `SELECT f.* FROM favouritemovies f INNER JOIN movie m ON f.movie=m.title WHERE f.movie='${title}' AND f.username='${username}'`
        );

        if (movie_exist)
          throw new MoleculerError(`This title is already in favourite.`);

        await this.adapter.repository
          .createQueryBuilder()
          .insert()
          .into(Favouritemovies)
          .values([{ username, movie: title }])
          .execute();

        return true;
      },
    },
    //call movie.delMovieFromFavourite '{"username": "gio", "title": "Matrix 2"}'
    delMovieFromFavourite: {
      cache: false,
      params: {
        title: {
          type: "string",
          optional: false,
          trim: true,
        },
        username: {
          type: "string",
          optional: false,
          trim: true,
          lowercase: true,
        },
      },
      async handler(ctx) {
        const { title, username } = ctx.params;
        const movie_exist = await this.adapter.connection
          .createQueryBuilder()
          .from(Favouritemovies)
          .where("movie = :movie", { movie: title })
          .andWhere("username = :username", { username: username })
          .getRawOne();

        if (!movie_exist)
          throw new MoleculerError(`This title is not in your favourite list.`);
        if (movie_exist.username != username)
          throw new MoleculerError(
            `To delete this movie from favourite list you must be user which created it .`
          );

        const delete_movie = await this.adapter.repository
          .createQueryBuilder()
          .delete()
          .from(Favouritemovies)
          .where("id = :id", { id: movie_exist.id })
          .execute();

        return true;
      },
    },

    //call movie.getMovieByTitle '{"title": "Matrixx2"}'
    getMovieByTitle: {
      cache: false,
      params: {
        title: {
          type: "string",
          optional: false,
          trim: true,
        },
      },
      async handler(ctx) {
        const { title } = ctx.params;
        const movie = await this.adapter.connection
          .createQueryBuilder()
          .from(Movie)
          .where("title = :title", { title: title })
          .getRawOne();

        return movie;
      },
    },
    //call movie.getMovies '{"title": "Amer"}'
    //call movie.getMovies '{"page": 1, "items_by_page":2}'
    getMovies: {
      cache: false,
      params: {
        title: {
          type: "string",
          optional: true,
          trim: true,
        },
        page: {
          type: "number",
          optional: true,
          min: 1,
          default: 1,
        },
        items_by_page: {
          type: "number",
          optional: true,
          default: 10,
        },
        order: {
          type: "enum",
          optional: true,
          values: ["ASC", "DESC"],
          default: "ASC",
        },
      },
      async handler(ctx) {
        const { title, page, order, items_by_page } = ctx.params;
        const skip = page * items_by_page - items_by_page;
        let movie = [];

        console.log({ skip, items_by_page });
        if (title)
          movie = await this.adapter.repository
            .createQueryBuilder()
            .where("title like :title", { title: `${title}%` })
            .skip(skip)
            .take(items_by_page)
            .orderBy("title", order)
            .getMany();
        else
          movie = await this.adapter.repository
            .createQueryBuilder()
            .skip(skip)
            .take(items_by_page)
            .orderBy("title", order)
            .getMany();

        console.log({ ...ctx.params });
        return movie;
      },
    },
  },

  methods: {
    getMovieByTitle: function (title: string) {
      return this.adapter.connection
        .createQueryBuilder()
        .from(Movie)
        .where("title = :title", { title: title })
        .getRawOne();
    },
  },
};
export = movie;
