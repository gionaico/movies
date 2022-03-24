import { Request } from "express";
import { ServiceBroker, Errors } from "moleculer";
// const { AuthenticationError } = require("apollo-server-express");

const AUTH = async (req: Request, broker: ServiceBroker) => {
  try {
    const token = req.get("Authorization") || "";
    console.log("token --------------", { token });

    const VALID_TOKEN: any = await broker.call(`auth.verify_token`, {
      token,
    });

    if (VALID_TOKEN instanceof Errors.MoleculerError)
      console.log("token no valido", { VALID_TOKEN });

    const result = { token, ...(VALID_TOKEN || {}) };

    broker.logger.info("VALID_TOKEN", { decode: VALID_TOKEN });

    return result;
  } catch (error) {
    broker.logger.error("AuthenticationError AUTH---------", { error });
    // throw new AuthenticationError(`Fallo de autentificacion en credenciales.`);
    return {};
  }
};

export { AUTH };
