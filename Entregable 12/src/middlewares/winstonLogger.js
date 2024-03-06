import winston from "winston"
import { config } from "../config/config.js"

const logger = winston.createLogger({
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    transports: []
})

// const transports = () => {

//     let transport = []

if(config.MODE === "Production"){

    //console.log("ENTRO")

    logger.add(
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({
                    fatal: "red",
                    error: "red",
                    warning: "yellow",
                    info: "blue",
                    http: "magenta",
                    debug: "cyan"
                }),
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    )

    logger.add(
        new winston.transports.File({
                level: "error",
                filename: "./src/logs/errors.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
    )

} else if (config.MODE === "Development"){
    logger.add(
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({
                    fatal: "red",
                    error: "red",
                    warning: "yellow",
                    info: "blue",
                    http: "magenta",
                    debug: "cyan"
                }),
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    )
}

    //return transport

//}

export const winstonLogger = (req, res, next) => {
    req.logger = logger

    next()
}