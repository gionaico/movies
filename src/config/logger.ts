import bunyan from "bunyan";
import bformat from "bunyan-format";

const loggerConf = {
  name: "movies-logs",
  streams: [
    {
      stream: bformat({
        outputMode: "short",
        levelInString: true,
      }),
    },
  ],
};
const loggerInstance = bunyan.createLogger(loggerConf);

export { loggerInstance, loggerConf };
