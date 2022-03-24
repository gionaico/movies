import { Authorized, Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
// import { Favouritemovies } from "../models/FavouriteMovies";
import { interfaceContext } from "../interfaces";

@Resolver()
export class FavouriteMoviesResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async addMovieToFavourite(
    @Arg("title") title: String,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker, user } = ctx;
    const { username } = user;

    const movie = await broker.call("movie.addToFavourite", {
      title,
      username,
    });
    return movie;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async delMovieFromFavourite(
    @Arg("title") title: String,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker, user } = ctx;
    const { username } = user;
    const movie = await broker.call("movie.delMovieFromFavourite", {
      title,
      username,
    });
    return movie;
  }
}
