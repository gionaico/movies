const { MoleculerError } = require("moleculer").Errors;
import { AuthenticationError } from "apollo-server-express";
import { Context } from "moleculer";

export default {
  // Global error handler
  "*": function (ctx: Context, error: any) {
    const actionName = ctx?.action?.name || "";
    this.logger.error(`Error occurred when '${actionName}' action was called`, {
      error,
      eventType: ctx.eventType,
    });

    // Throw further the error
    if (error instanceof MoleculerError || error instanceof AuthenticationError)
      throw error;

    throw new MoleculerError(`Action: ${actionName}`, 500, "general", {
      action: actionName,
      error,
    });
  },
};
