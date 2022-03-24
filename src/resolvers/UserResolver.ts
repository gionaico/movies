import { ServiceBroker } from "moleculer";
import { Request, Response } from "express";
import { Authorized, Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Users } from "../models/User";
import { CreateUserInput } from "../inputs/CreatUserInput";

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => String)
  book(@Arg("id") id: string) {
    return "sjkfksbfkjsbf IANDONO";
  }

  @Mutation(() => String)
  async login(
    @Arg("data") data: CreateUserInput,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker, res } = ctx;
    const user: UserWithToken = await broker.call("auth.login", data);
    // res.setHeader("Authorization", String(user?.token));
    return user.token;
  }

  @Mutation(() => Users)
  async register(
    @Arg("data") data: CreateUserInput,
    @Ctx() ctx: interfaceContext
  ) {
    const { broker } = ctx;
    const user = await broker.call("auth.register", data);
    return user;
  }
}
interface interfaceContext {
  broker: ServiceBroker;
  req: Request;
  res: Response;
}
interface interfaceSuccess {
  success: Boolean;
}
interface UserWithToken extends Users {
  token?: string;
}
