"use strict";

const { createLogger, format, transports, level } = require("winston");
const { v4: uuidv4 } = require('uuid');
require("winston-daily-rotate-file");

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp} - ${level} - ${context} - ${requestId}:: ${message} - ${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          filename: "application-%DATE%.infor.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true, // backup the log files
          maxSize: "20m", // max size of each file is 20MB
          maxFiles: "14d", //delete old logs after 14 days
          dirname: "src/logs",
          format: format.combine(
            format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            formatPrint
          ),
          level: "info", // set the log level to info
        }),
        new transports.DailyRotateFile({
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true, // backup the log files
          maxSize: "20m", // max size of each file is 20MB
          maxFiles: "14d", //delete old logs after 14 days
          dirname: "src/logs",
          format: format.combine(
            format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            formatPrint
          ),
          level: "error", // set the log level to info
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();
    return {
      context,
      requestId,
      metadata
    };
  }

  log(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
