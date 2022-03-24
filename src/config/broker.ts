import { ServiceBroker } from "moleculer";
const path_ = require("path");
import { loggerConf } from "./logger";

const broker = new ServiceBroker({
  namespace: process.env.NODE_ENV,
  serializer: process.env.MOLECULER_SERIALIZER,
  //   transporter: process.env.MOLECULER_TRANSPORTER,
  //   hotReload: process.env.NODE_ENV === "prod" ? false : true,
  // Number of seconds to send heartbeat packet to other nodes.
  heartbeatInterval: 10,
  // Number of seconds to wait before setting node to unavailable status.
  heartbeatTimeout: 30,
  logger: {
    type: "Bunyan",
    options: {
      //Logging level
      level: process.env.LEVEL_LOGGER || "info",
      bunyan: loggerConf,
    },
  },

  metrics: true,
  retryPolicy: {
    enabled: true,
    retries: 10,
    delay: 500,
    maxDelay: 2000,
    factor: 2,
    check: (err: any) => err && !!err.retryable,
  },
  cacher: false,
});
console.log({ __dirname });
broker.loadServices(
  path_.join(__dirname, "../services"),
  `*.${process.env.MOLECULER_SVC_EXTENSION}`
);

export default broker;
