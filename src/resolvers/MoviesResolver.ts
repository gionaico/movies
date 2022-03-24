import { Authorized, Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Movie } from "../models/Movie";
import { CreateMovieInput } from "../inputs/CreateMovieInput";
import { UpdateMovieInput } from "../inputs/UpdateMovieInput";
import { ListMovieInput } from "../inputs/ListMovieInput";
import { interfaceContext } from "../interfaces";

@Resolver()
export class MoviesResolver {
  @Authorized()
  @Query(() => [Movie])
  async getMovies(
    @Arg("data", { nullable: true }) data: ListMovieInput,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker } = ctx;
    const movies = await broker.call("movie.getMovies", { ...data });
    return movies;
  }

  @Authorized()
  @Query(() => Movie)
  async getOneMovie(@Arg("title") title: string, @Ctx() ctx: interfaceContext) {
    const { broker } = ctx;
    const movie = await broker.call("movie.getMovieByTitle", { title });
    return movie;
  }

  @Authorized()
  @Mutation(() => Movie)
  async createMovie(
    @Arg("data") data: CreateMovieInput,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker, user } = ctx;
    const { username } = user;
    const movie = await broker.call("movie.create", { ...data, username });
    return movie;
  }

  @Authorized()
  @Mutation(() => Movie)
  async updateMovie(
    @Arg("data") data: UpdateMovieInput,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker, user } = ctx;
    const { username } = user;

    const movie = await broker.call("movie.update", { ...data, username });
    return movie;
  }

  @Authorized()
  @Mutation(() => Movie)
  async deleteMovie(@Arg("title") title: String, @Ctx() ctx: interfaceContext) {
    const { broker, user } = ctx;
    const { username } = user;

    const movie = await broker.call("movie.delete", { title, username });
    return movie;
  }
}
