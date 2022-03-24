import { ServiceBroker } from "moleculer";
import { Request, Response } from "express";
import { Users } from "../models/User";

interface interfaceContext {
  broker: ServiceBroker;
  req: Request;
  res: Response;
  user: UserWithToken;
}

interface interfaceSuccess {
  success: Boolean;
}
interface UserWithToken extends Users {
  token?: string;
}

export { interfaceContext, interfaceSuccess, UserWithToken };
